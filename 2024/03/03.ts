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

const sum = Array.from(input.matchAll(/mul\((\d+),(\d+)\)/gm)).reduce(
	(acc, [, a, b]) => acc + parseInt(a ?? "", 10) * parseInt(b || "", 10),
	0
)

console.log(sum)
