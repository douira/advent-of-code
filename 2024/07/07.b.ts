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
	.split("\n")

function* calc(
	items: number[],
	index: number = items.length - 1
): Generator<number> {
	const value = items[index] as number
	if (index === 0) {
		yield value
	} else {
		for (const next of calc(items, index - 1)) {
			yield next + value
			yield next * value
			yield next * Math.pow(10, Math.ceil(Math.log10(value) + Number.EPSILON)) +
				value
		}
	}
}

console.log(
	input.reduce((sum, line) => {
		const [x, ...items] = line.split(/\D+/).map(x => parseInt(x)) as [
			number,
			...number[]
		]
		for (const result of calc(items)) {
			if (result === x) {
				return sum + x
			}
		}
		return sum
	}, 0)
)
