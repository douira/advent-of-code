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

const possibleByLength: Set<string>[] = Array.from(
	{ length: maxLength },
	() => new Set()
)
const notPossibleByLength: Set<string>[] = Array.from(
	{ length: maxLength },
	() => new Set()
)

const getPossibleByLength = (length: number) =>
	possibleByLength[length - 1] as Set<string>
const getNotPossibleByLength = (length: number) =>
	notPossibleByLength[length - 1] as Set<string>

for (const piece of pieces) {
	getPossibleByLength(piece.length).add(piece)
}

const isPossible = (goal: string): boolean => {
	const length = goal.length
	if (length === 0) {
		return true
	}
	const possiblesThisLength = getPossibleByLength(length)
	if (possiblesThisLength.has(goal)) {
		return true
	}
	const notPossiblesThisLength = getNotPossibleByLength(length)
	if (notPossiblesThisLength.has(goal)) {
		return false
	}

	// goal needs to be split
	for (
		let i = minPieceLength, end = Math.min(maxPieceLength, length - 1);
		i <= end;
		i++
	) {
		if (isPossible(goal.slice(0, i)) && isPossible(goal.slice(i))) {
			possiblesThisLength.add(goal)
			return true
		}
	}

	notPossiblesThisLength.add(goal)
	return false
}

let possibleCount = 0
for (const goal of goals) {
	const possible = isPossible(goal)
	console.log(`${possible ? "YES" : "NO"}: ${goal}`)
	if (possible) {
		possibleCount++
	}
}

console.log(`Possible: ${possibleCount}`)
