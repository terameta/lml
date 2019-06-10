require( '@tensorflow/tfjs-node' );

export class LogisticRegression {

}

// import { Tensor, zeros, moments } from '@tensorflow/tfjs';
// import * as plot from 'node-remote-plot';

// export class LinearRegression {

// 	public weights: Tensor;
// 	private sampleSize = 0;
// 	private numberOfFeatures = 0;
// 	private mean: Tensor;
// 	private stddev: Tensor;
// 	private msePrev = 0;
// 	private mseCurr = 0;
// 	private mseHistory = [];
// 	private learningRateHistory = [];

// 	private features: Tensor;

// 	constructor( features: Tensor, private labels: Tensor, private options: LinearRegressionOptions = {} ) {
// 		this.prepareFeatures( features ).then( result => { this.features = result; } );
// 		this.options = { learningRate: 0.1, maxIterations: 1000, ...options };
// 		this.sampleSize = features.shape[0];
// 		this.numberOfFeatures = features.shape[1];
// 		this.weights = zeros( [this.numberOfFeatures, 1] );
// 	}

// 	private prepareFeatures = async ( f: Tensor, shouldSet = false ) => {
// 		if ( !this.mean ) {
// 			const { mean, variance } = await moments( f, 0 );
// 			this.mean = mean;
// 			this.stddev = variance.pow( .5 );
// 		}
// 		return f.sub( this.mean ).div( this.stddev );
// 	}

// 	public train = async () => {
// 		while ( !this.features ) { await this.waiter(); }
// 		const batchQuantity = Math.floor( this.features.shape[0] / this.options.batchSize );
// 		for ( let i = 0; i < this.options.maxIterations; i++ ) {
// 			for ( let j = 0; j < batchQuantity; j++ ) {
// 				await this.gradientDescent(
// 					this.features.slice( [j * this.options.batchSize, 0], [this.options.batchSize, -1] ), // Feature slice
// 					this.labels.slice( [j * this.options.batchSize, 0], [this.options.batchSize, -1] ) 		// label slice
// 				);
// 			}
// 		}
// 		plot( {
// 			x: this.mseHistory.reverse(),
// 			y: this.learningRateHistory,
// 			xLabel: 'MSE',
// 			yLabel: 'Learning Rate'
// 		} );
// 	}

// 	private waiter = ( timeout = 500 ) => {
// 		return new Promise( ( resolve, reject ) => {
// 			setTimeout( () => {
// 				resolve();
// 			}, timeout );
// 		} );
// 	}

// 	private gradientDescent = async ( features: Tensor, labels: Tensor ) => {
// 		const guesses = features.matMul( this.weights );
// 		const differences = guesses.sub( labels );
// 		const slopes = features.transpose().matMul( differences ).div( features.shape[0] ).mul( this.options.learningRate );
// 		this.weights = this.weights.sub( slopes );
// 		this.msePrev = this.mseCurr;
// 		this.mseCurr = ( await differences.sum().pow( 2 ).div( differences.shape[0] ).array() ) as any;
// 		this.mseHistory.unshift( this.mseCurr );
// 		if ( this.mseCurr && this.msePrev ) {
// 			if ( this.mseCurr > this.msePrev ) this.options.learningRate *= 0.95;
// 			if ( this.mseCurr < this.msePrev ) this.options.learningRate *= 1.05;
// 		}
// 		this.learningRateHistory.push( this.options.learningRate );
// 		// differences.sum().pow( 2 ).div( differences.shape[0] ).array().then( console.log );
// 		// console.log( this.options.learningRate, this.mseCurr, this.msePrev );
// 	}

// 	public test = async ( testFeatures: Tensor, testLabels: Tensor ) => {
// 		testFeatures = await this.prepareFeatures( testFeatures );
// 		// this.weights.print();
// 		// testLabels.print();
// 		// testFeatures.matMul( this.weights ).print();
// 		// testFeatures.print();
// 		const sstot = ( await testLabels.sub( testLabels.mean() ).pow( 2 ).sum().array() as number );
// 		const ssres = ( await testLabels.sub( testFeatures.matMul( this.weights ) ).pow( 2 ).sum().array() as number );
// 		console.log( ssres, 'vs', sstot );
// 		const rSquared = 1 - ssres / sstot;
// 		return rSquared;
// 	}

// 	public predict = ( observation: Tensor ): Tensor => {
// 		return observation.matMul( this.weights );
// 	}
// }

// export interface LinearRegressionOptions {
// 	maxIterations?: number,
// 	learningRate?: number,
// 	batchSize?: number
// }