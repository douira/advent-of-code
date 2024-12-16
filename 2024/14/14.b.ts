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

const field = Array.from({ length: height }, () =>
	Array.from({ length: width }, () => 0)
)

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

// init field
robots.forEach(robot => {
	;((field[robot.y] as number[])[robot.x] as number)++
})

let i
for (i = 1; ; i++) {
	robots.forEach(robot => {
		;((field[robot.y] as number[])[robot.x] as number)--
		robot.x = (robot.x + robot.vx + width) % width
		robot.y = (robot.y + robot.vy + height) % height
		;((field[robot.y] as number[])[robot.x] as number)++
	})

	// check if there's a line of 31 in a row
	for (let y = 0; y < height; y++) {
		let robotsInRow = 0
		for (let x = 0; x < width; x++) {
			if ((field[y] as number[])[x] as number > 0) {
				robotsInRow++
			} else {
				robotsInRow = 0
			}

			if (robotsInRow >= 10) {
					console.log(i)
					console.log(
						field
							.map(row => row.map(n => (n > 0 ? "#" : " ")).join(""))
							.join("\n")
					)
				process.exit(0)
			}
		}
	}
}

