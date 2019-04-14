import { tensor, Tensor, moments } from '@tensorflow/tfjs-node';
import { readCSV } from '../utilities/readcsv';
import * as _ from 'lodash';

const run = async () => {
	const dataSet = await readCSV( './datafiles/kc_house_data.csv' );

	const [testSet, trainingSet] = splitDataSet( dataSet, .05 );

	console.clear();
	console.log( 'Size of the main data set:', dataSet.length );
	console.log( 'Size of the training data set:', trainingSet.length );
	console.log( 'Size of the test data set:', testSet.length );

	const featureSet = trainingSet.map( t => ( [parseFloat( t.lat ), parseFloat( t.long ), parseFloat( t.sqft_lot ), parseFloat( t.sqft_living )] ) );
	const labelSet = trainingSet.map( t => [parseFloat( t.price )] );
	const testFeatureSet = testSet.map( t => ( [parseFloat( t.lat ), parseFloat( t.long ), parseFloat( t.sqft_lot ), parseFloat( t.sqft_living )] ) );
	const testLabelset = testSet.map( t => [parseFloat( t.price )] );

	const rawFeatures = tensor( featureSet );
	const { mean, variance } = moments( rawFeatures, 0 );
	mean.print();
	variance.print();
	const features = rawFeatures.sub( mean ).div( variance.pow( .5 ) );
	console.log( features.shape );
	features.print();
	const labels = tensor( labelSet );
	const k = 3;

	const results: any[] = [];

	for ( let t of testSet ) {
		const lat = parseFloat( t.lat );
		const long = parseFloat( t.long );
		const sf = parseFloat( t.sqft_lot );
		const sfl = parseFloat( t.sqft_living );
		const price = parseFloat( t.price );
		const pp = tensor( [lat, long, sf, sfl] ).sub( mean ).div( variance.pow( .5 ) ); //predictionPoint
		pp.print();
		const result = ( await knn( features, labels, pp, k, mean, variance ) );
		results.push( { lat, long, sf, sfl, price: price.toFixed( 2 ), result: result.toFixed( 2 ), e: ( ( price - result ) / price * 100 ).toFixed( 2 ) } );
	}
	console.table( results );

}

const knn = async ( features: Tensor, labels: Tensor, predictionPoint: Tensor, k: number, mean: Tensor, variance: Tensor ) => {
	const array: number[][] = ( await features.sub( predictionPoint ).pow( 2 ).sum( 1 ).expandDims( 1 ).concat( labels, 1 ).array() as any );
	const result = array.sort( ( a1, a2 ) => a1[0] - a2[0] ).slice( 0, 3 ).map( x => x[1] ).reduce( ( x, y ) => x + y ) / k;
	return result;
}

run();


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