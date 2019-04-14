import { readCSV } from '../utilities/readcsv';
import { sortBy } from '../utilities/sorters';
import * as _ from 'lodash';
import { distance } from '../utilities/distance';

const start = async () => {
	console.clear();
	const rawDataSet = ( await readCSV( './datafiles/fifa19data.csv', { mapHeaders: ( { header, index } ) => index === 0 ? 'RowNum' : header } ) )
		// .map( r => ( { power: parseInt( r.ShotPower, 10 ), reputation: parseInt( r['International Reputation'], 10 ) } ) );
		.map( r => ( {
			features: [
				parseFloat( r['Age'] ),
				parseFloat( r['Overall'] ),
				parseFloat( r['Potential'] ),
				// parseFloat(r['International Reputation']),
				parseFloat( r['Weak Foot'] ),
				parseFloat( r['Skill Moves'] ),
				parseFloat( r['Crossing'] ),
				parseFloat( r['Finishing'] ),
				parseFloat( r['HeadingAccuracy'] ),
				parseFloat( r['ShortPassing'] ),
				parseFloat( r['Volleys'] ),
				parseFloat( r['Dribbling'] ),
				parseFloat( r['Curve'] ),
				parseFloat( r['FKAccuracy'] ),
				parseFloat( r['LongPassing'] ),
				parseFloat( r['BallControl'] ),
				parseFloat( r['Acceleration'] ),
				parseFloat( r['SprintSpeed'] ),
				parseFloat( r['Agility'] ),
				parseFloat( r['Reactions'] ),
				parseFloat( r['Balance'] ),
				parseFloat( r['ShotPower'] ),
				parseFloat( r['Jumping'] ),
				parseFloat( r['Stamina'] ),
				parseFloat( r['Strength'] ),
				parseFloat( r['LongShots'] ),
				parseFloat( r['Aggression'] ),
				parseFloat( r['Interceptions'] ),
				parseFloat( r['Positioning'] ),
				parseFloat( r['Vision'] ),
				parseFloat( r['Penalties'] ),
				parseFloat( r['Composure'] ),
				parseFloat( r['Marking'] ),
				parseFloat( r['StandingTackle'] ),
				parseFloat( r['SlidingTackle'] ),
				parseFloat( r['GKDiving'] ),
				parseFloat( r['GKHandling'] ),
				parseFloat( r['GKKicking'] ),
				parseFloat( r['GKPositioning'] ),
				parseFloat( r['GKReflexes'] ),
			],
			// value: toValueNum( r.Value )
			label: parseFloat( r['International Reputation'] )
		} ) );
	const featureHeaders = [
		'Age', 'Overall', 'Potential', 'Weak Foot', 'Skill Moves', 'Crossing', 'Finishing', 'HeadingAccuracy', 'ShortPassing', 'Volleys',
		'Dribbling', 'Curve', 'FKAccuracy', 'LongPassing', 'BallControl', 'Acceleration', 'SprintSpeed', 'Agility', 'Reactions', 'Balance',
		'ShotPower', 'Jumping', 'Stamina', 'Strength', 'LongShots', 'Aggression', 'Interceptions', 'Positioning', 'Vision', 'Penalties',
		'Composure', 'Marking', 'StandingTackle', 'SlidingTackle', 'GKDiving', 'GKHandling', 'GKKicking', 'GKPositioning', 'GKReflexes'];
	const dataSet = minMax( rawDataSet, rawDataSet[0].features.length );
	const k = 5;

	const [testSet, trainingSet] = splitDataSet( dataSet, .5 );


	console.log( 'Size of the main data set:', dataSet.length );
	console.log( 'Size of the training data set:', trainingSet.length );
	console.log( 'Size of the test data set:', testSet.length );


	featureHeaders.forEach( ( h, hi ) => {
		const trainingSubSet = trainingSet.map( r => ( { features: [r.features[hi]], label: r.label } ) );
		let resultSet = testSet.map( t => ( { result: knn( trainingSubSet, [t.features[hi]], k ), target: t.label, isCorrect: false } ) );
		resultSet = resultSet.map( t => ( { ...t, isCorrect: t.result === t.target } ) );
		console.log( 'Relevancy of ' + hi + ' - ' + h + ' is:', resultSet.filter( r => r.isCorrect ).length / resultSet.length * 100 + '%' );
	} );
	console.log( '-----------------------------------------' );
	// for ( let i = 1; i <= 20; i++ ) {
	let resultSet = testSet.map( t => ( { result: knn( trainingSet, t.features, k ), target: t.label, isCorrect: false } ) );
	resultSet = resultSet.map( t => ( { ...t, isCorrect: t.result === t.target } ) )
	// // console.table( resultSet );
	console.log( 'Accuracy of k=', k, ' => ', resultSet.filter( r => r.isCorrect ).length / resultSet.length * 100 + '%' );
	// }
	console.log( '-----------------------------------------' );
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
		.map( r => [distance( r.features, predictionPoint ), r.label] )
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

const minMax = ( data: { features: number[], label: number }[], featureCount: number ) => {
	const clonedData = _.cloneDeep( data );

	for ( let i = 0; i < featureCount; i++ ) {
		const column = clonedData.map( row => row.features[i] );
		const min = _.min( column );
		const max = _.max( column );

		for ( let j = 0; j < clonedData.length; j++ ) {
			clonedData[j].features[i] = ( clonedData[j].features[i] - min ) / ( max - min );
		}
	}

	return clonedData;
}

start().then( () => {
	console.log( 'Finished all' );
} ).catch( ( e ) => {
	console.error( 'Finished with Error' );
	console.error( e );
} );