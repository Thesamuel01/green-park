export interface CsvReader {
  read: <T>(buffer: Buffer) => Promise<T[]>;
}
