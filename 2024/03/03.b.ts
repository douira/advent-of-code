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

const sum = Array.from(
	input.matchAll(/(mul)\((\d+),(\d+)\)|(do)\(\)|(don't)\(\)/gm)
).reduce((acc, [,, a, b, doIns, dont]) => {
	if (doIns) {
		acc = Math.abs(acc)
	} else if (dont) {
		acc = -Math.abs(acc)
	} else if (acc >= 0) {
		acc += parseInt(a ?? "", 10) * parseInt(b ?? "", 10)
	}
	return acc
}, 0)

console.log(Math.abs(sum))
