import { readCSV } from '../utilities/readcsv';
import { sortBy } from '../utilities/sorters';


const start = async () => {
	const results = await readCSV('./datafiles/fifa19data.csv', { mapHeaders: ({ header, index }) => index === 0 ? 'RowNum' : header });
	// console.log(results[0]);
	// console.log(results.map(r => [r.Name, r.Age, r.Wage]).sort(sortBy(1)));
	console.log(results.sort(sortBy('Name', true)).map(r => [r.Name, r.Age, r.Wage]));
}

start().then(() => {
	console.log('Finished all');
}).catch((e) => {
	console.error('Finished with Error');
	console.error(e);
});