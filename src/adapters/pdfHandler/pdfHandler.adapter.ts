import fs from 'fs/promises';
import { PDFDocument } from 'pdf-lib';
import PDFParser from 'pdf-parse';
import { type PDFHandler } from '../pdfHandler.interface';
import path from 'path';

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
}
