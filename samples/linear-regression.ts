import { Tensor, zeros, moments } from '@tensorflow/tfjs';

export class LinearRegression {

	public weights: Tensor;
	private sampleSize = 0;
	private numberOfFeatures = 0;
	private mean: Tensor;
	private stddev: Tensor;

	private features: Tensor;

	constructor( features: Tensor, private labels: Tensor, private options: LinearRegressionOptions = {} ) {
		this.prepareFeatures( features ).then( result => { this.features = result; } );
		this.options = { learningRate: 0.1, maxIterations: 1000, ...options };
		this.sampleSize = features.shape[0];
		this.numberOfFeatures = features.shape[1];
		this.weights = zeros( [this.numberOfFeatures, 1] );
	}

	private prepareFeatures = async ( f: Tensor, shouldSet = false ) => {
		if ( !this.mean ) {
			const { mean, variance } = await moments( f, 0 );
			this.mean = mean;
			this.stddev = variance.pow( .5 );
		}
		return f.sub( this.mean ).div( this.stddev );
	}

	public train = async () => {
		while ( !this.features ) { await this.waiter(); }
		// this.features.print();
		for ( let i = 0; i < this.options.maxIterations; i++ ) {
			await this.gradientDescent();
		}
	}

	private waiter = ( timeout = 500 ) => {
		return new Promise( ( resolve, reject ) => {
			setTimeout( () => {
				resolve();
			}, timeout );
		} );
	}

	private gradientDescent = async () => {
		const guesses = this.features.matMul( this.weights );
		const differences = guesses.sub( this.labels );
		const slopes = this.features.transpose().matMul( differences ).div( this.features.shape[0] ).mul( this.options.learningRate );
		this.weights = this.weights.sub( slopes );
	}

	public test = async ( testFeatures: Tensor, testLabels: Tensor ) => {
		testFeatures = await this.prepareFeatures( testFeatures );
		// this.weights.print();
		// testLabels.print();
		// testFeatures.matMul( this.weights ).print();
		// testFeatures.print();
		const sstot = ( await testLabels.sub( testLabels.mean() ).pow( 2 ).sum().array() as number );
		const ssres = ( await testLabels.sub( testFeatures.matMul( this.weights ) ).pow( 2 ).sum().array() as number );
		// console.log( ssres, 'vs', sstot );
		const rSquared = 1 - ssres / sstot;
		return rSquared;
	}
}

export interface LinearRegressionOptions {
	maxIterations?: number,
	learningRate?: number
}