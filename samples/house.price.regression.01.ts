require( '@tensorflow/tfjs-node' );
import { readCSV } from "../utilities/readcsv";
import * as _ from 'lodash';
import { tensor, tensor2d, onesLike, ones, memory, moments } from '@tensorflow/tfjs';
import { LinearRegression } from './linear-regression';

console.clear();

const run = async () => {
	const rawDataSet = await readCSV( './datafiles/cars.csv' );
	const dataSet = rawDataSet.map( d => ( {
		horsepower: parseFloat( d.horsepower ),
		weight: parseFloat( d.weight ),
		displacement: parseFloat( d.displacement ),
		// acceleration: parseFloat( d.acceleration ),
		mpg: parseFloat( d.mpg )
	} ) );
	// console.log( dataSet );

	const [testSet, trainingSet] = splitDataSet( dataSet, 13 );

	console.log( '--- Size of the main data set:', dataSet.length );
	console.log( '--- Size of the training data set:', trainingSet.length );
	console.log( '--- Size of the test data set:', testSet.length );
	console.log( '--- We are trying to calculate MPG as a function of Horsepower ---' );
	console.log( '--- MPG = m * HP + b' );
	const features = ones( [trainingSet.length, 1] ).concat( tensor( trainingSet.map( t => [
		t.horsepower,
		t.weight,
		t.displacement,
		// t.acceleration
	] ) ), 1 );
	const testFeatures = ones( [testSet.length, 1] ).concat( tensor( testSet.map( t => [
		t.horsepower,
		t.weight,
		t.displacement,
		// t.acceleration
	] ) ), 1 );
	const labels = tensor( trainingSet.map( t => [t.mpg] ) );
	const testLabels = tensor( testSet.map( t => [t.mpg] ) );
	// // ones( [features.shape[0], 1] ).concat( features, 1 ).print();

	const regression = new LinearRegression( features, labels, { learningRate: .5, maxIterations: 128, batchSize: 32 } );
	await regression.train();
	regression.weights.print();
	// await testFeatures.matMul( regression.weights ).sub( testLabels ).array().then( console.log );
	console.log( 'R2:', await regression.test( testFeatures, testLabels ) );
	console.log( 'Infering:' );
	console.log( ( await tensor2d( [1, 88, 1.1395, 97], [1, 4] ).array() )[0] );
	regression.predict( tensor2d( [1, 88, 1.1395, 97], [1, 4] ) ).print();
	// features.slice( 0, 1 ).print();
}


run();


const splitDataSet = ( dataSet: any[], testSizePercentage: number ) => {
	const testSize = Math.floor( dataSet.length * testSizePercentage / 100 );
	const shuffled = _.shuffle( dataSet );
	return [shuffled.slice( 0, testSize ), shuffled.slice( testSize )];
}