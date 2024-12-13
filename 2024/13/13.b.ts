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

const realPrizeOffset = 10000000000000
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
	const px = parseInt(pxRaw as string, 10) + realPrizeOffset
	const py = parseInt(pyRaw as string, 10) + realPrizeOffset

	// this is never true, so the two vectors are never colinear,
	// which means that if there is a solution it's unique
	if (ax == ay && bx == by) {
		throw new Error("colinear")
	}

	const slopeA = ay / ax
	const slopeB = by / bx
	const offsetA = 0
	const offsetB = py - slopeB * px
	const intersectionX = (offsetB - offsetA) / (slopeA - slopeB)

	const aCount = Math.ceil(intersectionX / ax)
	const bCount = Math.ceil((px - intersectionX) / bx)

	for (let ao = aCount - 5; ao <= aCount + 5; ao++) {
		for (let bo = bCount - 5; bo <= bCount + 5; bo++) {
			if (ao < 0 || bo < 0) {
				continue
			}

			const xFinal = ax * ao + bx * bo
			const yFinal = ay * ao + by * bo
			if (xFinal === px && yFinal === py) {
				return acc + aCost * ao + bCost * bo
			}
		}
	}

	return acc
}, 0)

console.log(tokens)
