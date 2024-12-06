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

let count = input.reduce((acc, line) => {
	let ok: boolean
	let omit = -1
	do {
		const { min, max, pos, neg } = line.split(/\s+/).reduce(
			(acc, n, i) => {
				if (i === omit) {
					return acc
				}
				const num = parseInt(n, 10)
				const { min, max, prev } = acc
				if (!isNaN(prev)) {
					const delta = prev - num
					const absDelta = Math.abs(delta)
					acc.min = Math.min(min, absDelta)
					acc.max = Math.max(max, absDelta)
					acc.pos &&= delta > 0
					acc.neg &&= delta < 0
				}
				acc.prev = num
				return acc
			},
			{ min: Infinity, max: -Infinity, pos: true, neg: true, prev: NaN }
		)
		ok =
			Math.abs(min) >= 1 && Math.abs(max) <= 3 && (pos || neg) && !(pos && neg)
	} while (!ok && omit++ < line.length)

	return acc + (ok ? 1 : 0)
}, 0)

console.log(count)