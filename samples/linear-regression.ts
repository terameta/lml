import { Tensor, zeros } from '@tensorflow/tfjs';
import * as _ from 'lodash';

export class LinearRegression {

	public m: number = 0;
	public b: number = 0;

	public weights: Tensor;
	private sampleSize = 0;
	private numberOfFeatures = 0;

	constructor( private features: Tensor, private labels: Tensor, private options: LinearRegressionOptions = {} ) {
		this.options = { learningRate: 0.1, maxIterations: 1000, ...options };
		this.sampleSize = this.features.shape[0];
		this.numberOfFeatures = this.features.shape[1];
		this.weights = zeros( [this.numberOfFeatures, 1] );
	}

	public train = async () => {
		for ( let i = 0; i < this.options.maxIterations; i++ ) {
			this.gradientDescent();
		}
	}

	private gradientDescent = async () => {
		const guesses = this.features.matMul( this.weights );
		const differences = guesses.sub( this.labels );
		differences.print();
		this.features.
			transpose().
			matMul( differences ).
			div( this.sampleSize ).
			print();
		// this.features.
		// 	transpose().
		// 	matMul( differences ).
		// 	div( this.n );


		// // const currentGuessesForMPG = this.features.map( row => this.m * row[0] + this.b );
		// // const bSlope = _.sum( currentGuessesForMPG.map( ( guess, i ) => guess - this.labels[i][0] ) ) / this.features.length;
		// // const mSlope = _.sum( currentGuessesForMPG.map( ( guess, i ) => ( guess - this.labels[i][0] ) * this.features[i][0] ) ) / this.features.length;
		// // this.b -= bSlope * this.options.learningRate;
		// // this.m -= mSlope * this.options.learningRate;
		// // // console.log( 'MS:', mSlope.toFixed( 8 ), 'M:', this.m.toFixed( 8 ), 'BS:', bSlope.toFixed( 8 ), 'B:', this.b.toFixed( 8 ) );
	}
}

export interface LinearRegressionOptions {
	maxIterations?: number,
	learningRate?: number
}