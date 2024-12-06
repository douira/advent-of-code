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
let centerSum = 0
for (const line of input) {
	if (line.includes("|")) {
		rules.add(line)
	} else if (line.length) {
		const items = line.split(",").map(n => parseInt(n))
		if (
			items.every((n, i) => {
				for (let j = i + 1; j < items.length; j++) {
					if (rules.has(`${items[j]}|${n}`)) {
						return false
					}
				}
				return true
			})
		) {
			centerSum += items[Math.floor(items.length / 2)] as number
		}
	}
}

console.log(centerSum)
