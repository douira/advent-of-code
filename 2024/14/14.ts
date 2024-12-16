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

// origin top left, positive x to the right, positive y to the bottom

// const width = 11, height = 7 // test size
const width = 101,
	height = 103

const centerX = Math.floor(width / 2)
const centerY = Math.floor(height / 2)

// const field = Array.from({ length: height }, () => Array.from({ length: width }, () => 0))

const robots = input.map(line => {
	const [, xRaw, yRaw, vxRaw, vyRaw] = line.match(
		/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/
	) as RegExpMatchArray
	const x = parseInt(xRaw as string, 10)
	const y = parseInt(yRaw as string, 10)
	const vx = parseInt(vxRaw as string, 10)
	const vy = parseInt(vyRaw as string, 10)

	return { x, y, vx, vy }
})

for (let i = 0; i < 100; i++) {
	robots.forEach(robot => {
		robot.x = (robot.x + robot.vx + width) % width
		robot.y = (robot.y + robot.vy + height) % height
	})
}

// count robots in each quadrant
let topLeft = 0,
	topRight = 0,
	bottomLeft = 0,
	bottomRight = 0
robots.forEach(robot => {
	if (robot.x < centerX) {
		if (robot.y < centerY) {
			topLeft++
		} else if (robot.y > centerY) {
			bottomLeft++
		}
	} else if (robot.x > centerX) {
		if (robot.y < centerY) {
			topRight++
		} else if (robot.y > centerY) {
			bottomRight++
		}
	}
})

const result = topLeft * topRight * bottomLeft * bottomRight

console.log(result)
