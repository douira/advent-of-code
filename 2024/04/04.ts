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

const size = input.length // it's a square
const field: string[][] = input.map(line => line.split(""))

const get = (i: number, j: number) => {
	if (i < 0 || j < 0 || i >= size || j >= size) {
		return null
	}

	return (field[i] as string[])[j]
}

const word = "XMAS"

let count = 0
for (let i = 0; i < size; i++) {
	for (let j = 0; j < size; j++) {
		if (get(i, j) === word[0]) {
			for (let di = -1; di <= 1; di++) {
				for (let dj = -1; dj <= 1; dj++) {
					if (di === 0 && dj === 0) {
						continue
					}

					for (let k = 1; k < word.length; k++) {
						if (get(i + di * k, j + dj * k) !== word[k]) {
							break
						}

						if (k === word.length - 1) {
							count++
						}
					}
				}
			}
		}
	}
}

console.log(count)
