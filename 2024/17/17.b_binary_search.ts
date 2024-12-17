const target = [2, 4, 1, 3, 7, 5, 1, 5, 0, 3, 4, 2, 5, 5, 3, 0]
console.log(target.join(""))

let output: bigint[] = []

const runProgram = (a: bigint) => {
	output = []

	while (true) {
		const b = (a & 7n) ^ 3n

		output.push((b ^ 5n ^ (a >> b)) & 7n)

		a = a >> 3n

		if (a === 0n) {
			break
		}
	}
}

// the ith digit can only change up to k times before the i+1th digit changes
// for the leftmost (last) digit k = 7,
// for the second-to-last digit 7 <= k <= 24,
// for all earlier digits k = 24
const maxRunCount = 24

// a run (a run is a sequence of the same digit until it or a higher digit changes) is at least 0.04 as long as the containing run
const runMinLengthFraction = 0.01
const runMinLengthDivisor = BigInt(Math.ceil(1 / runMinLengthFraction))

// binary search that finds the smallest number that satisfies the condition.
// the predicate should turn from false to true at some point.
// returns min if the predicate is always true, returns max + 1 if the predicate is always false.
const binarySearch = (
	min: bigint,
	max: bigint,
	predicate: (n: bigint) => boolean
) => {
	while (min < max) {
		const mid = (min + max) / 2n

		if (predicate(mid)) {
			max = mid
		} else {
			min = mid + 1n
		}
	}

	return min
}

// find a search bound
let maxValue = 1n
do {
	maxValue *= 2n
	runProgram(maxValue)
} while (output.length <= target.length)

// find the range in which the output length matches the program length
const globalMax =
	binarySearch(1n, maxValue, n => {
		runProgram(n)
		return output.length > target.length
	}) - 1n
const globalMin = binarySearch(1n, globalMax, n => {
	runProgram(n)
	return output.length === target.length
})

// reduce the range for each digit
let min = globalMin
let max = globalMax
for (let digitIndex = target.length - 1; digitIndex >= 0; digitIndex--) {
	const targetDigit = BigInt(target[digitIndex] as number)

	// reduce min and max to the first run with this digit
	const range = max - min

	// if range is small, stop this type of stepping and just search the whole range
	if (range < 1000) {
		break
	}
	const minRunLength = range / runMinLengthDivisor
	if (minRunLength <= 10) {
		break
	}

	let test = min
	do {
		runProgram(test)
		const digit = output[digitIndex]

		if (digit === targetDigit) {
			break
		}

		test += minRunLength
	} while (true)

	let nextMin = test
	do {
		runProgram(nextMin)
		const digit = output[digitIndex]

		if (digit !== targetDigit) {
			break
		}

		nextMin -= minRunLength
	} while (true)
	if (nextMin < min) {
		nextMin = min
	}

	min = binarySearch(nextMin, test, n => {
		runProgram(n)
		return output[digitIndex] === targetDigit
	})

	let nextMax = test
	do {
		runProgram(nextMax)
		const digit = output[digitIndex]

		if (digit !== targetDigit) {
			break
		}

		nextMax += minRunLength
	} while (true)

	max =
		binarySearch(test, nextMax, n => {
			runProgram(n)
			return output[digitIndex] !== targetDigit
		}) - 1n

	console.log(`target digit ${targetDigit}, min: ${min}, max: ${max}, ${output.join("")}`)
}

for (let i = min - 100000n; i <= max + 100000n; i++) {
	runProgram(i)
	if (
		output.length === target.length &&
		output.every((n, j) => n === BigInt(target[j] as number))
	) {
		console.log(i)
		break
	}
}
