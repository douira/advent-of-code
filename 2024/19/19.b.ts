import fs from "fs"
import path from "path"
const [piecesRaw, goalsRaw] = fs
	.readFileSync(
		path.join(
			__dirname,
			`input_${path.basename(process.argv[1] || "").split(".")[0]}`
		)
	)
	.toString()
	.trim()
	.split("\n\n") as [string, string]

const pieces = piecesRaw.split(", ")
const goals = goalsRaw.trim().split("\n")

const minPieceLength = Math.min(...pieces.map(p => p.length))
const maxPieceLength = Math.max(...pieces.map(p => p.length))
const maxGoalLength = Math.max(...goals.map(g => g.length))
const maxLength = Math.max(maxPieceLength, maxGoalLength)

const piecesByLength: Map<string, number>[] = Array.from(
	{ length: maxLength },
	() => new Map()
)

const getGoalsByLength = (length: number) =>
	piecesByLength[length - 1] as Map<string, number>

const pieceSet = new Set(pieces)

const possibleWays = (goal: string, depth: number = 0): number => {
	const length = goal.length
	if (length < minPieceLength) {
		return 0
	}
	const goalsThisLength = getGoalsByLength(length)
	const cached = goalsThisLength.get(goal)
	if (cached !== undefined) {
		return cached
	}

	let ways = 0
	if (pieceSet.has(goal)) {
		ways++
	}

	if (length > minPieceLength) {
		// goal could also be composed
		for (
			let i = minPieceLength,
				end = Math.min(maxPieceLength, length - minPieceLength);
			i <= end;
			i++
		) {
			const left = goal.slice(0, i)
			if (pieceSet.has(left)) {
				const right = goal.slice(i)
				const waysRight = possibleWays(right, depth + 1)
				ways += waysRight
			}
		}
	}

	goalsThisLength.set(goal, ways)
	return ways
}

let waysSum = 0
for (const goal of goals) {
	const ways = possibleWays(goal)
	console.log(`${ways ? ways : "-"} ways: ${goal}`)
	waysSum += ways
}

console.log(`Possible Ways: ${waysSum}`)
