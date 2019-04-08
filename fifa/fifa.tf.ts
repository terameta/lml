import { tensor, tensor2d } from '@tensorflow/tfjs-node';

// Features are Longitute & Latitute
const features = tensor( [
	[-121, 47],
	[-121.2, 46.5],
	[-122, 46.4],
	[-120.9, 46.7],
] );

// Labels are Property Prices
const labels = tensor( [
	[200],
	[250],
	[215],
	[240],
] );

const predictionPoint = tensor( [-121, 47] );

features.print();

features.
	sub( predictionPoint ).
	pow( 2 ).
	sum( 1 ).
	expandDims( 1 ).
	pow( .5 ).
	concat( labels, 1 ).
	print();