import fs from "fs"
import path from "path"
import { hrtime } from "process"

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

// union find structure
type Node = { parent: Node; size: number }
const blocked = new Map<string, Node>()

const find = (a: Node): Node => {
	while (a.parent !== a) {
		a.parent = a.parent.parent
		a = a.parent
	}
	return a
}

const union = (a: Node | undefined, b: Node | undefined) => {
	if (!a || !b) {
		return
	}

	const rootA = find(a)
	const rootB = find(b)

	if (rootA === rootB) {
		return
	}

	if (rootA.size < rootB.size) {
		rootA.parent = rootB
		rootB.size += rootA.size
	} else {
		rootB.parent = rootA
		rootA.size += rootB.size
	}
}

const makeNode = () => {
	const node: Node = { parent: null, size: 1 } as unknown as Node
	node.parent = node
	return node
}

const bottomLeftNode = makeNode()
const topRightNode = makeNode()

const getKey = (x: number, y: number) => `${x},${y}`

const getNode = (x: number, y: number) => {
	if (x < 0 || y > fieldSize) {
		return bottomLeftNode
	}
	if (y < 0 || y > fieldSize) {
		return topRightNode
	}

	return blocked.get(getKey(x, y))
}

const start = hrtime.bigint()
for (const block of blocks) {
	const node = makeNode()
	blocked.set(getKey(block.x, block.y), node)
	union(getNode(block.x - 1, block.y), node)
	union(getNode(block.x + 1, block.y), node)
	union(getNode(block.x, block.y - 1), node)
	union(getNode(block.x, block.y + 1), node)

	// cells can block the path diagonally too
	union(getNode(block.x - 1, block.y - 1), node)
	union(getNode(block.x + 1, block.y - 1), node)
	union(getNode(block.x - 1, block.y + 1), node)
	union(getNode(block.x + 1, block.y + 1), node)

	if (find(bottomLeftNode) === find(topRightNode)) {
		console.log(`Unreachable after block ${getKey(block.x, block.y)}`)
		break
	}
}

const end = hrtime.bigint()
const time = end - start
console.log(`Time: ${time / BigInt(1e6)}ms`)
