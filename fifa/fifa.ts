import { readCSV } from '../utilities/readcsv';
import { sortBy } from '../utilities/sorters';
import * as _ from 'lodash';

const k = 5;
const predictionPoint = 100;

function distance(point: number) {
	return Math.abs(point - predictionPoint);
}

const start = async () => {
	const results = await readCSV('./datafiles/fifa19data.csv', { mapHeaders: ({ header, index }) => index === 0 ? 'RowNum' : header });
	// // console.log(results[0]);
	// // console.log(results.map(r => [r.Name, r.Age, r.Wage]).sort(sortBy(1)));
	console.clear();
	// console.log(results.map(r => [distance(r.ShotPower), r['International Reputation'], r.Name]).sort(sortBy(0)).slice(0, k));
	// console.log('\n\n\n---------------------\n');
	console.log(
		_.chain(results)
			.map(r => [distance(r.ShotPower), r['International Reputation'], r.Name])
			.sortBy(r => r[0])
			.slice(0, k)
			.countBy(r => r[1])
			.toPairs()
			.sortBy(r => r[1])
			.last()
			.first()
			.value()
	);
}

start().then(() => {
	console.log('Finished all');
}).catch((e) => {
	console.error('Finished with Error');
	console.error(e);
});