import fs from "fs"
import path from "path"
const input = fs
	.readFileSync(
		path.join(
			__dirname,
			`input_${path.basename(process.argv[1] || "").split(".")[0]}`
		)
	)
	.toString()
	.trim()
	.split(" ")
	.map(n => parseInt(n, 10))

const totalTimes = 75
const cache: Map<number, number>[] = new Array(totalTimes + 1)
	.fill(0)
	.map(() => new Map())

const count = (n: number, times: number): number => {
	if (times === 0) {
		return 1
	}

	if (n === 0) {
		return count(1, times - 1)
	}

	const digits = Math.floor(Math.log10(n + Number.EPSILON)) + 1
	if (digits % 2 === 0) {
		let timesCache = cache[times] as Map<number, number>
		const cacheResult = timesCache.get(n)
		if (cacheResult !== undefined) {
			return cacheResult
		}

		const factor = Math.pow(10, digits / 2)
		const a = Math.floor(n / factor)
		const b = Math.floor(n % factor)
		timesCache = cache[times - 1] as Map<number, number>
		let resultA = timesCache.get(a)
		if (resultA === undefined) {
			resultA = count(a, times - 1)
			timesCache.set(a, resultA)
		}
		let resultB = timesCache.get(b)
		if (resultB === undefined) {
			resultB = count(b, times - 1)
			timesCache.set(b, resultB)
		}
		return resultA + resultB
	}

	return count(n * 2024, times - 1)
}

const result = input.reduce((acc, n) => acc + count(n, totalTimes), 0)

console.log(result)
