import { createReadStream } from 'fs';
import * as csv from 'csv-parser';

export const readCSV = (path: string, options: any = null): Promise<any[]> => {
  const toReturn = [];
  return new Promise((resolve, reject) => {
    createReadStream(path)
      .pipe(csv(options))
      .on('data', data => toReturn.push(data))
      .on('error', error => { reject(error); })
      .on('end', () => { resolve(toReturn); })
  });
}