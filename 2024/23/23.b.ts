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

const connections = new Map<string, Set<string>>()
input.forEach(line => {
	const [a, b] = line.split("-") as [string, string]
	let setA = connections.get(a)
	if (!setA) {
		setA = new Set()
		connections.set(a, setA)
	}
	setA.add(b)

	let setB = connections.get(b)
	if (!setB) {
		setB = new Set()
		connections.set(b, setB)
	}
	setB.add(a)
})

const findMaximalClique = (
	clique: Set<string>,
	candidates: Set<string>,
	excluded: Set<string>
) => {
	if (candidates.size === 0 && excluded.size === 0) {
		const result = Array.from(clique).sort().join(",")
		console.log(result)
	}

	for (const node of candidates) {
		const neighbors = connections.get(node)!
		findMaximalClique(
			clique.union(new Set([node])),
			neighbors.intersection(candidates),
			neighbors.intersection(excluded)
		)
		candidates.delete(node)
		excluded.add(node)
	}
}

findMaximalClique(new Set(), new Set(connections.keys()), new Set())
