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

const nodes = new Set(connections.keys())
const kCliques = new Set<string>() // contains strings of k nodes: "tz,wk,...,od,qb"

const findKCliques = (k: number, clique: Set<string>): boolean => {
	if (k === 0) {
		const result = Array.from(clique).sort().join(",")
		kCliques.add(result)
		console.log(result)
		return true
	}

	for (const node of nodes) {
		if (clique.has(node)) {
			continue
		}

		let isClique = true
		for (const member of clique) {
			if (!connections.get(node)?.has(member)) {
				isClique = false
				break
			}
		}

		if (isClique) {
			clique.add(node)
			if (findKCliques(k - 1, clique)) {
				return true
			}
			clique.delete(node)
		}
	}

	return false
}

for (let i = 3; i <= 1000; i++) {
	console.log(`Finding ${i}-cliques`)
	if (!findKCliques(i, new Set())) {
		console.log(`No ${i}-cliques found`)
		break
	}
}
