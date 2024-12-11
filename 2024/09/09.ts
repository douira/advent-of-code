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

const blocks = input
	.split("")
	.map(n => parseInt(n, 10))
	.flatMap<number>((l, i) =>
		i % 2 === 0 ? new Array(l).fill(i / 2) : new Array(l).fill(NaN)
)

let write = 0
let read = blocks.length - 1

while (read > write) {
	const writeBlock = blocks[write] as number
	const readBlock = blocks[read] as number

	if (!isNaN(writeBlock)) {
		write++
	} else if (isNaN(readBlock)) {
		read--
	} else {
		blocks[write] = readBlock
		blocks[read] = writeBlock
		write++
		read--
	}
}

let result = blocks.reduce((acc, id, i) => acc + (isNaN(id) ? 0 : id) * i, 0)

console.log(result)
