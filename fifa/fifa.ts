import { promisify } from 'util';
import { readFile } from 'fs';

const readFileP = promisify(readFile);

const start = async () => {
	console.log(await readFileP('./datafiles/fifa19data.csv','utf8'));
}

start().then(() => {
	console.log('Finished all');
}).catch((e) => {
	console.error('Finished with Error');
	console.error(e);
});