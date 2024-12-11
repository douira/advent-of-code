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

let lastId: number = NaN
const blocks = input
	.split("")
	.map(n => parseInt(n, 10))
	.flatMap<number>((l, i) => {
		const id = i / 2
		lastId = id
		return i % 2 === 0 ? new Array(l).fill(id) : new Array(l).fill(NaN)
	})

if (isNaN(lastId)) {
	throw new Error("No blocks")
}

for (let moveId = lastId; moveId >= 0; moveId--) {
	const blockEnd = blocks.lastIndexOf(moveId)
	let blockStart = blockEnd
	while (blockStart >= 0 && blocks[blockStart] === moveId) {
		blockStart--
	}
	blockStart++

	let blockLength = blockEnd - blockStart + 1

	let freeStart = NaN
	for (let write = 0; write < blockStart; write++) {
		const writeBlock = blocks[write] as number
		if (isNaN(writeBlock)) {
			if (isNaN(freeStart)) {
				freeStart = write
			}
			const freeLength = write - freeStart + 1
			if (freeLength >= blockLength) {
				blocks.splice(freeStart, blockLength, ...new Array(blockLength).fill(moveId))
				blocks.splice(blockStart, blockLength, ...new Array(blockLength).fill(NaN))
				break
			}
		} else {
			freeStart = NaN
		}
	}
}

let result = blocks.reduce((acc, id, i) => acc + (isNaN(id) ? 0 : id) * i, 0)

console.log(result)
