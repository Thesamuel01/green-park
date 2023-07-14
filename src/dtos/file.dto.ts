export interface FileDTO {
  buffer: Buffer;
  mimetype: string;
  fileName?: string;
  size: number;
}
