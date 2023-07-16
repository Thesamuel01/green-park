import fs from 'fs/promises';
import {
  PDFDocument,
  rgb,
  StandardFonts,
  PageSizes,
  type PDFPage
} from 'pdf-lib';
import PDFParser from 'pdf-parse';
import { type PDFHandler } from '../pdfHandler.interface';
import path from 'path';
import { type BillAllStr, type FileBase64 } from 'src/dtos';

export class PDFHandlerAdapter implements PDFHandler {
  async readBillPDF<T>(buffer: Buffer): Promise<T[]> {
    const pdfDoc = await PDFDocument.load(buffer);
    const separatedPages: Uint8Array[] = [];
    const data: Array<{
      page: number;
      buffer: Buffer;
      data: Record<string, string>;
    }> = [];

    for (let i = 0; i < pdfDoc.getPageCount(); i += 1) {
      const pdfBytes = await PDFDocument.create();
      const [copiedPage] = await pdfBytes.copyPages(pdfDoc, [i]);
      pdfBytes.addPage(copiedPage);

      const pdfData = await pdfBytes.save();
      separatedPages.push(pdfData);
    }

    const parserResults = await Promise.all(
      separatedPages.map(async (pageUint8) => {
        const pageBuffer = Buffer.from(pageUint8);
        const data = await PDFParser(pageBuffer);

        return {
          buffer: pageBuffer,
          ...data
        };
      })
    );

    const fields = new Map([
      ['Sacado:', 'nome'],
      ['Id Lote:', 'unidade'],
      ['Valor:', 'valor'],
      ['Cód.:', 'linha_digitavel']
    ]);

    for (let pageNum = 0; pageNum < parserResults.length; pageNum++) {
      const page = parserResults[pageNum].text;
      const pageData = page.trim().split('\n');
      const obj: {
        page: number;
        buffer: Buffer;
        data: Record<string, string>;
      } = {
        page: pageNum + 1,
        buffer: parserResults[pageNum].buffer,
        data: {}
      };

      for (const [key, value] of fields) {
        const regex = new RegExp(key);
        const matchingRow = pageData.find((pageRow) => regex.test(pageRow));

        if (matchingRow != null) {
          obj.data[value] = matchingRow.substring(key.length).trim();
        }
      }

      data.push(obj);
    }

    return data as T[];
  }

  async save(buffer: Buffer, filePath: string): Promise<void> {
    const directory = path.dirname(filePath);

    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(filePath, buffer);
  }

  async createBase64PDF(data: BillAllStr[]): Promise<FileBase64> {
    const pdfDoc = await PDFDocument.create();
    const [pageHeight, pageWidth] = PageSizes.A4;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const { width, height } = page.getSize();

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const table = {
      headers: [
        { text: 'id', width: 50 },
        { text: 'recipient_name', width: 150 },
        { text: 'lot_id', width: 50 },
        { text: 'value', width: 70 },
        { text: 'barcode', width: 150 },
        { text: 'active', width: 50 },
        { text: 'created_at', width: 120 }
      ],
      rows: data.map((item) => [
        { text: item.id.toString(), width: 50 },
        { text: item.recipientName, width: 150 },
        { text: item.lotId.toString(), width: 50 },
        { text: item.value, width: 70 },
        { text: item.barcode, width: 150 },
        { text: item.active.toString(), width: 50 },
        { text: item.createdAt, width: 120 }
      ])
    };

    const tableTopMargin = 50;
    const cellMargin = 5;
    const yStart = height - tableTopMargin;

    const font = await pdfDoc.embedFont('Helvetica');
    const fontSize = 10;
    const lineHeight = fontSize + 2;

    function drawCell(
      page: PDFPage,
      x: number,
      y: number,
      text: string,
      color = rgb(0, 0, 0)
    ): void {
      page.drawText(text, { x, y, size: 10, color, font, lineHeight });
    }

    const getMaxCellWidths = (): number[] => {
      const maxCellWidths = Array(table.headers.length).fill(0);

      table.headers.forEach((cell, cellIndex) => {
        const textWidth = helveticaFont.widthOfTextAtSize(cell.text, fontSize);
        if (textWidth > maxCellWidths[cellIndex]) {
          maxCellWidths[cellIndex] = textWidth;
        }
      });

      table.rows.forEach((row) => {
        row.forEach((cell, cellIndex) => {
          const textWidth = helveticaFont.widthOfTextAtSize(
            cell.text as string,
            fontSize
          );
          if (textWidth > maxCellWidths[cellIndex]) {
            maxCellWidths[cellIndex] = textWidth;
          }
        });
      });

      return maxCellWidths;
    };

    function drawTable(page: PDFPage): void {
      const maxCellWidths = getMaxCellWidths();
      let xPos =
        (width - maxCellWidths.reduce((acc, cellWidth) => acc + cellWidth, 0)) /
        2;
      let yPos = yStart;

      table.headers.forEach((header, index) => {
        const cellWidth = maxCellWidths[index];
        drawCell(page, xPos, yPos - 20, header.text, rgb(0.25, 0.45, 0.6));
        xPos += cellWidth + cellMargin;
      });

      yPos -= 20;

      table.rows.forEach((row, _rowIndex) => {
        xPos =
          (width -
            maxCellWidths.reduce((acc, cellWidth) => acc + cellWidth, 0)) /
          2;

        row.forEach((cell, cellIndex) => {
          const cellWidth = maxCellWidths[cellIndex];
          const textColor = rgb(0, 0, 0);
          drawCell(page, xPos, yPos - 20, cell.text as string, textColor);

          xPos += cellWidth + cellMargin;
        });

        yPos -= 20;
      });
    }

    drawTable(page);

    const pdfBytes = await pdfDoc.save();

    return {
      base64: Buffer.from(pdfBytes).toString('base64')
    };
  }
}
