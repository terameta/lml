import { Tensor, zeros, moments } from '@tensorflow/tfjs';

export class LinearRegression {

	public weights: Tensor;
	private sampleSize = 0;
	private numberOfFeatures = 0;
	private mean: number;
	private stddev: number;

	constructor( private features: Tensor, private labels: Tensor, private options: LinearRegressionOptions = {} ) {
		this.options = { learningRate: 0.1, maxIterations: 1000, ...options };
		this.sampleSize = this.features.shape[0];
		this.numberOfFeatures = this.features.shape[1];
		this.weights = zeros( [this.numberOfFeatures, 1] );
		this.prepareFeatures( features );
	}

	private prepareFeatures = async ( f: Tensor, shouldSet = false ) => {
		const { mean, variance } = await moments( f );
		this.mean = ( await mean.array() as number );
		this.stddev = Math.pow( ( await variance.array() as number ), .5 );
		console.log( this.mean, this.stddev, ( await variance.array() ) );
	}

	public train = async () => {
		for ( let i = 0; i < this.options.maxIterations; i++ ) {
			await this.gradientDescent();
		}
	}

	private gradientDescent = async () => {
		const guesses = this.features.matMul( this.weights );
		const differences = guesses.sub( this.labels );
		const slopes = this.features.transpose().matMul( differences ).div( this.features.shape[0] ).mul( this.options.learningRate );
		this.weights = this.weights.sub( slopes );
	}

	public test = async ( testFeatures: Tensor, testLabels: Tensor ) => {
		// testFeatures.print();
		// testLabels.print();
		const sstot = ( await testLabels.sub( testLabels.mean() ).pow( 2 ).sum().array() as number );
		const ssres = ( await testLabels.sub( testFeatures.matMul( this.weights ) ).pow( 2 ).sum().array() as number );
		console.log( ssres, 'vs', sstot );
		const rSquared = 1 - ssres / sstot;
		return rSquared;
	}
}

export interface LinearRegressionOptions {
	maxIterations?: number,
	learningRate?: number
}