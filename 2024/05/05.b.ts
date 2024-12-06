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

const rules: Set<string> = new Set()
let fixedCenterSum = 0
for (const line of input) {
	if (line.includes("|")) {
		rules.add(line)
	} else if (line.length) {
		const items = line.split(",").map(n => parseInt(n))
		if (
			!items.every((n, i) => {
				for (let j = i + 1; j < items.length; j++) {
					if (rules.has(`${items[j]}|${n}`)) {
						return false
					}
				}
				return true
			})
		) {
			// items must be wrong, do topological sort
			const sorted: typeof items = []

			while (items.length) {
				const next = items.findIndex(n =>
					items.every(m => !rules.has(`${m}|${n}`))
				)

				if (next === -1) {
					throw new Error("No valid next item")
				}

				sorted.push(...items.splice(next, 1))
			}

			fixedCenterSum += sorted[Math.floor(sorted.length / 2)] as number
		}
	}
}

console.log(fixedCenterSum)
