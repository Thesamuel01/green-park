import { type BillAllStr, type FileBase64 } from '../dtos';

export interface PDFHandler {
  readBillPDF: <T>(buffer: Buffer) => Promise<T[]>;
  save: (buffer: Buffer, path: string) => Promise<void>;
  createBase64PDF: (data: BillAllStr[]) => Promise<FileBase64>;
}
