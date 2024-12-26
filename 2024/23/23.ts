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

const threeCliques = new Set<string>() // ab,cd,ef

connections.forEach((setA, a) => {
	setA.forEach(b => {
		connections.get(b)?.forEach(c => {
			if (connections.get(c)?.has(a)) {
				threeCliques.add([a, b, c].sort().join(","))
			}
		})
	})
})

let resultCount = 0
for (const clique of threeCliques) {
	const [a, b, c] = clique.split(",") as [string, string, string]
	if (a.startsWith("t") || b.startsWith("t") || c.startsWith("t")) {
		resultCount++
	}
}

console.log(resultCount)
