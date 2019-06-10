require( '@tensorflow/tfjs-node' );
import * as tf from '@tensorflow/tfjs';
import { readCSV } from "../utilities/readcsv";
import { splitDataSet } from "../utilities/splitter";

// import * as _ from 'lodash';
// import { tensor, onesLike, ones, memory, moments, tensor2d, sequential, layers, losses, Tensor2D } from '@tensorflow/tfjs';

const init = async () => {
	console.clear();
	console.log( '=== We are starting Logistic Regression' );
	const rawDataSet = await readCSV( './datafiles/cars.csv' );
	const dataSet = rawDataSet.map( d => ( {
		weight: parseFloat( d.weight ),
		displacement: parseFloat( d.displacement ),
		horsepower: parseFloat( d.horsepower ),
		passed: d.passedemissions === 'TRUE' ? 1 : 0
	} ) );
	// dataSet.forEach( rds => console.log( rds ) );
	const [testSet, trainingSet] = splitDataSet( dataSet, 13 );
	console.log( '--- Size of the main data set:', dataSet.length );
	console.log( '--- Size of the training data set:', trainingSet.length );
	console.log( '--- Size of the test data set:', testSet.length );
	console.log( '--- We are trying to calculate if the emission test is passed' );
}

init();


// const initTF = async () => {
// 	const rawDataSet = await readCSV( './datafiles/cars.csv' );
// 	const dataSet = rawDataSet.map( d => ( {
// 		horsepower: parseFloat( d.horsepower ),
// 		weight: parseFloat( d.weight ),
// 		displacement: parseFloat( d.displacement ),
// 		// acceleration: parseFloat( d.acceleration ),
// 		mpg: parseFloat( d.mpg )
// 	} ) );
// 	// console.log( dataSet );


// 	console.log( '--- Size of the main data set:', dataSet.length );
// 	console.log( '--- We are trying to calculate MPG as a function of Horsepower ---' );
// 	console.log( '--- MPG = m * HP + b' );
// 	// console.log( dataSet.map( d => [d.horsepower, d.weight, d.displacement] ) );
// 	// console.log( dataSet );
// 	// console.log( dataSet.map( d => d.mpg ) );

// 	// const xs = tensor2d( [1, 2, 3, 4, 5], [5, 1] );
// 	prexs = tensor2d( dataSet.map( d => [d.horsepower, d.weight, d.displacement] ), [dataSet.length, 3] );
// 	// const ys = tensor2d( [10, 20, 30, 40, 50], [5, 1] );
// 	const ys = tensor2d( dataSet.map( d => d.mpg ), [dataSet.length, 1] );

// 	const { mean, variance } = await moments( prexs, 0 );
// 	tmean = mean;
// 	tstddev = variance.pow( .5 );
// 	xs = prexs.sub( mean ).div( tstddev );

// 	await model.add( layers.dense( { units: 1, inputShape: [3] } ) );
// 	await model.compile( {
// 		loss: losses.meanSquaredError,
// 		optimizer: 'sgd'
// 	} );
// 	const history = await model.fit( xs, ys, { epochs: 128, verbose: 0 } );
// }

// const predict = async ( n: Tensor2D ) => {
// 	console.log( 'We are predicting:' );
// 	const newN = n.sub( tmean ).div( tstddev );
// 	xs.print();
// 	prexs.print();
// 	n.print();
// 	newN.print();
// 	tmean.print();
// 	tstddev.print();
// 	console.log( model.predict( newN ).toString() );
// 	// return model.predict( tensor2d( [n], [1, 1] ) );
// }


// const doAll = async () => {
// 	await initTF();
// 	console.log( 'Init finished' );
// 	predict( tensor2d( [88, 1.1395, 97], [1, 3] ) );
// }

// console.clear();

// doAll();