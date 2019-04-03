export const distance = ( pointA: number | number[], pointB: number | number[] ) => {
	const pA = Array.isArray( pointA ) ? pointA : [pointA];
	const pB = Array.isArray( pointB ) ? pointB : [pointB];
	const length = pA.length > pB.length ? pA.length : pB.length;
	let sum = 0;
	for ( let i = 0; i < length; i++ ) {
		sum += ( pA[i] - pB[i] ) ** 2;
	}
	return sum ** .5;
}