export interface PDFHandler {
  readBillPDF: <T>(buffer: Buffer) => Promise<T[]>;
  save: (buffer: Buffer, path: string) => Promise<void>;
}
