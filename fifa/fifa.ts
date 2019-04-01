import { promisify } from 'util';
import { readFile } from 'fs';

const readFileP = promisify(readFile);

const start = async () => {
	const data = (await readFileP('./datafiles/fifa19data.csv', 'utf8')).trim().split('\n').map(r => r.split(','));
	const headers = data.splice(0, 1)[0];
	headers[0] = 'Row Number';
	const messi = data[0];
	const ronal = data[1];
	const neyma = data[2];
	console.clear();
	for (let i = 0; i < 30; i++) {
		console.log(i, headers[i], messi[i], ronal[i], neyma[i]);
	}
	console.log('Dates are also spliting. So this is not good');
}

start().then(() => {
	console.log('Finished all');
}).catch((e) => {
	console.error('Finished with Error');
	console.error(e);
});