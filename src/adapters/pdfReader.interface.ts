import { type BillFileDTO } from '../dtos/billFile.dto';

export interface PDFReader {
  read: (buffer: Buffer) => Promise<BillFileDTO[]>;
}
