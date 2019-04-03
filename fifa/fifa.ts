import { readCSV } from '../utilities/readcsv';
import { sortBy } from '../utilities/sorters';
import * as _ from 'lodash';
import { distance } from '../utilities/distance';

const start = async () => {
	console.clear();
	const results = ( await readCSV( './datafiles/fifa19data.csv', { mapHeaders: ( { header, index } ) => index === 0 ? 'RowNum' : header } ) )
		// .map( r => ( { power: parseInt( r.ShotPower, 10 ), reputation: parseInt( r['International Reputation'], 10 ) } ) );
		.map( r => ( {
			features: [
				parseInt( r['Age'], 10 ),
				parseInt( r['Overall'], 10 ),
				parseInt( r['Potential'], 10 ),
				// parseInt(r['International Reputation'], 10),
				parseInt( r['Weak Foot'], 10 ),
				parseInt( r['Skill Moves'], 10 ),
				parseInt( r['Crossing'], 10 ),
				parseInt( r['Finishing'], 10 ),
				parseInt( r['HeadingAccuracy'], 10 ),
				parseInt( r['ShortPassing'], 10 ),
				parseInt( r['Volleys'], 10 ),
				parseInt( r['Dribbling'], 10 ),
				parseInt( r['Curve'], 10 ),
				parseInt( r['FKAccuracy'], 10 ),
				parseInt( r['LongPassing'], 10 ),
				parseInt( r['BallControl'], 10 ),
				parseInt( r['Acceleration'], 10 ),
				parseInt( r['SprintSpeed'], 10 ),
				parseInt( r['Agility'], 10 ),
				parseInt( r['Reactions'], 10 ),
				parseInt( r['Balance'], 10 ),
				parseInt( r['ShotPower'], 10 ),
				parseInt( r['Jumping'], 10 ),
				parseInt( r['Stamina'], 10 ),
				parseInt( r['Strength'], 10 ),
				parseInt( r['LongShots'], 10 ),
				parseInt( r['Aggression'], 10 ),
				parseInt( r['Interceptions'], 10 ),
				parseInt( r['Positioning'], 10 ),
				parseInt( r['Vision'], 10 ),
				parseInt( r['Penalties'], 10 ),
				parseInt( r['Composure'], 10 ),
				parseInt( r['Marking'], 10 ),
				parseInt( r['StandingTackle'], 10 ),
				parseInt( r['SlidingTackle'], 10 ),
				parseInt( r['GKDiving'], 10 ),
				parseInt( r['GKHandling'], 10 ),
				parseInt( r['GKKicking'], 10 ),
				parseInt( r['GKPositioning'], 10 ),
				parseInt( r['GKReflexes'], 10 ),
			],
			// value: toValueNum( r.Value )
			value: parseInt( r['International Reputation'], 10 )
		} ) );

	const [testSet, trainingSet] = splitDataSet( results, 1 );


	console.log( 'Size of the main data set:', results.length );
	console.log( 'Size of the training data set:', trainingSet.length );
	console.log( 'Size of the test data set:', testSet.length );


	for ( let i = 1; i <= 10; i++ ) {
		let resultSet = testSet.map( t => ( { result: knn( trainingSet, t.features, i ), target: t.value, isCorrect: false } ) );
		resultSet = resultSet.map( t => ( { ...t, isCorrect: t.result === t.target } ) )
		// console.table( resultSet );
		console.log( 'Accuracy of k=', i, ' => ', resultSet.filter( r => r.isCorrect ).length / resultSet.length * 100 + '%' );
	}
}

const toValueNum = ( value: string = '' ) => {
	let multiplier = 1;
	if ( value.indexOf( 'M' ) >= 0 ) multiplier = 1000000;
	if ( value.indexOf( 'K' ) >= 0 ) multiplier = 1000;
	let numVal = value.replace( /[^0-9.]/g, '' );
	return parseFloat( numVal ) * multiplier;
}

const knn = ( rows: any[], predictionPoint: number[], k: number ) => {
	return _.chain( rows )
		.map( r => [distance( r.features, predictionPoint ), r.value] )
		.sortBy( r => r[0] )
		.slice( 0, k )
		.countBy( r => r[1] )
		.toPairs()
		.sortBy( r => r[1] )
		.last()
		.first()
		.toInteger()
		.value()
}

const splitDataSet = ( dataSet: any[], testSizePercentage: number ) => {
	const testSize = Math.floor( dataSet.length * testSizePercentage / 100 );
	const shuffled = _.shuffle( dataSet );
	return [shuffled.slice( 0, testSize ), shuffled.slice( testSize )];
}

start().then( () => {
	console.log( 'Finished all' );
} ).catch( ( e ) => {
	console.error( 'Finished with Error' );
	console.error( e );
} );