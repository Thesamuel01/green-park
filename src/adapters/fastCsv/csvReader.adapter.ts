import { parse } from '@fast-csv/parse';
import { type CsvReader } from '..';
import { Readable } from 'stream';

type InputItem = Record<string, string>;

export class FastCsvReader implements CsvReader {
  async read<T>(buffer: Buffer): Promise<T[]> {
    return await new Promise<T[]>((resolve, reject) => {
      const results: InputItem[] = [];

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      readableStream
        .pipe(parse({ headers: true }))
        .on('data', (data: InputItem) => results.push(data))
        .on('error', (error: Error) => {
          reject(error);
        })
        .on('end', () => {
          const transformedData: T[] = results.map((item) => {
            const transformedItem: Partial<T> = {};
            const [[keys, values]] = Object.entries(item);
            const propNames = keys.split(';');
            const propValues = values.split(';');

            for (let index = 0; index < propNames.length; index++) {
              const propName = propNames[index];
              const propValue = propValues[index];
              transformedItem[propName as keyof T] = propValue as T[keyof T];
            }

            return transformedItem as T;
          });

          resolve(transformedData);
        });
    });
  }
}
