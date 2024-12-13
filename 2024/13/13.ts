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
	.split("\n\n")

const maxButtonPresses = 100 // per button
const aCost = 3
const bCost = 1

const tokens = input.reduce((acc, group) => {
	const [lineA, lineB, linePrize] = group.split("\n") as [
		string,
		string,
		string
	]

	const [, axRaw, ayRaw] = lineA.match(/(\d+)\D+(\d+)/) as RegExpMatchArray
	const [, bxRaw, byRaw] = lineB.match(/(\d+)\D+(\d+)/) as RegExpMatchArray
	const [, pxRaw, pyRaw] = linePrize.match(/(\d+)\D+(\d+)/) as RegExpMatchArray

	const ax = parseInt(axRaw as string, 10)
	const ay = parseInt(ayRaw as string, 10)
	const bx = parseInt(bxRaw as string, 10)
	const by = parseInt(byRaw as string, 10)
	const px = parseInt(pxRaw as string, 10)
	const py = parseInt(pyRaw as string, 10)

	let x = 0
	let y = 0
	let aCount = 0
	let bCount = 0

	// use b until max or just below target
	bCount = Math.min(Math.floor((px - x) / bx), Math.min(maxButtonPresses, Math.floor((py - y) / by)))
	x += bx * bCount
	y += by * bCount

	if (x === px && y === py) {
		return acc + bCount * bCost
	}

	// undershot, use a until reached, remove b if overshot
	while (aCount < maxButtonPresses) {
		const newX = x + ax
		const newY = y + ay
		if (newX <= px && newY <= py) {
			x = newX
			y = newY
			aCount++
		} else if (bCount > 0) {
			x -= bx
			y -= by
			bCount--
		} else {
			// impossible
			break
		}

		if (x === px && y === py) {
			return acc + aCount * aCost + bCount * bCost
		}
	}

	return acc
}, 0)

console.log(tokens)
