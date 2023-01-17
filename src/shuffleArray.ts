export const shuffleArray = (array: string[], pairs: number) => {
	const slicedArray = array.slice(0, pairs);
	let randomArray = [...slicedArray, ...slicedArray];
	let index = randomArray.length,
		randomIndex;

	while (index !== 0) {
		randomIndex = Math.floor(Math.random() * index);
		index--;
		[randomArray[index], randomArray[randomIndex]] = [
			randomArray[randomIndex],
			randomArray[index]
		];
	}

	return randomArray;
};
