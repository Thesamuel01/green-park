import { type BillFileDTO } from './billFile.dto';

export interface BillPDFFileDTO {
  page: number;
  buffer: Buffer;
  data: BillFileDTO;
}
