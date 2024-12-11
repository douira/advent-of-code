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

const size = input.length // square field

const nodes = new Set<string>()
const mark = (x: number, y: number) => {
	if (!(x < 0 || x >= size || y < 0 || y >= size)) {
		nodes.add(`${x},${y}`)
	}
}

type vector = { x: number; y: number }
const emitters = new Map<string, vector[]>()
input.forEach((line, y) =>
	line.split("").forEach((name, x) => {
		if (name !== ".") {
			const emitter = emitters.get(name) || []
			emitter.push({ x, y })
			emitters.set(name, emitter)
		}
	})
)

emitters.forEach(positions =>
	positions.forEach(a =>
		positions.forEach(b => {
			if (a === b) {
				return
			}

			const ab = {
				x: b.x - a.x,
				y: b.y - a.y,
			}
			mark(b.x + ab.x, b.y + ab.y)
			mark(a.x - ab.x, a.y - ab.y)
		})
	)
)

console.log(nodes.size)