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

const fieldSize = 70

const blocks = input.map(line => {
	const [x, y] = line.split(",").map(n => parseInt(n, 10)) as [number, number]
	return { x, y }
})

const blocked = new Map<string, boolean>()

const isBlocked = (x: number, y: number) => blocked.has(`${x},${y}`)

const checkIfGoalReachable = (x: number, y: number) => {
	const queue = [{ x: 0, y: 0 }]
	const visited = new Set<string>()

	const add = (x: number, y: number) => {
		if (x < 0 || y < 0 || x > fieldSize || y > fieldSize) {
			return
		}

		if (isBlocked(x, y)) {
			return
		}

		const key = `${x},${y}`
		if (visited.has(key)) {
			return
		}

		visited.add(key)
		queue.push({ x, y })
	}

	while (queue.length > 0) {
		const { x, y } = queue.shift()!
		if (x === fieldSize && y === fieldSize) {
			return true
		}

		add(x + 1, y)
		add(x - 1, y)
		add(x, y + 1)
		add(x, y - 1)
	}

	return false
}

for (const block of blocks) {
	blocked.set(`${block.x},${block.y}`, true)

	if (!checkIfGoalReachable(block.x, block.y)) {
		console.log(`Unreachable after block ${block.x},${block.y}`)
		break
	}
}

// draw the field
// console.log(
// 	Array.from({ length: fieldSize + 1 }, (_, i) =>
// 		Array.from({ length: fieldSize + 1 }, (_, j) =>
// 			isBlocked(j, i) ? "#" : "."
// 		).join("")
// 	).join("\n")
// )
