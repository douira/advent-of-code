import fs from "fs"
import path from "path"

type Comparator<T> = (valueA: T, valueB: T) => number

const swap = (arr: unknown[], i: number, j: number) => {
	;[arr[i], arr[j]] = [arr[j], arr[i]]
}

class PriorityQueue<T> {
	#heap
	#isGreater

	constructor(comparator: Comparator<T>)
	constructor(comparator: Comparator<T>, init: T[] = []) {
		this.#heap = init
		this.#isGreater = (a: number, b: number) =>
			comparator(init[a] as T, init[b] as T) > 0
	}

	get size(): number {
		return this.#heap.length
	}

	peek(): T | undefined {
		return this.#heap[0]
	}

	add(value: T): void {
		this.#heap.push(value)
		this.#siftUp()
	}

	poll(): T | undefined
	poll(
		heap = this.#heap,
		value = heap[0],
		length = heap.length
	): T | undefined {
		if (length) {
			swap(heap, 0, length - 1)
		}

		heap.pop()
		this.#siftDown()

		return value
	}

	#siftUp(): void
	#siftUp(node = this.size - 1, parent = ((node + 1) >>> 1) - 1): void {
		for (
			;
			node && this.#isGreater(node, parent);
			node = parent, parent = ((node + 1) >>> 1) - 1
		) {
			swap(this.#heap, node, parent)
		}
	}

	#siftDown(): void
	#siftDown(size = this.size, node = 0, isGreater = this.#isGreater): void {
		while (true) {
			const leftNode = (node << 1) + 1
			const rightNode = leftNode + 1

			if (
				(leftNode >= size || isGreater(node, leftNode)) &&
				(rightNode >= size || isGreater(node, rightNode))
			) {
				break
			}

			const maxChild =
				rightNode < size && isGreater(rightNode, leftNode)
					? rightNode
					: leftNode

			swap(this.#heap, node, maxChild)

			node = maxChild
		}
	}
}

const input = fs
	.readFileSync(
		path.join(
			__dirname,
			`input_${path.basename(process.argv[1] || "").split(".")[0]}`
		)
	)
	.toString()
	.trim()

const field = input
	.trim()
	.split("\n")
	.map(line => line.split(""))
const fieldWidth = (field[0] as string[]).length
const fieldHeight = field.length

const get = (x: number, y: number) => {
	if (x < 0 || x >= fieldWidth || y < 0 || y >= fieldHeight) {
		return null
	}
	return (field[y] as string[])[x] as string
}

const set = (x: number, y: number, value: string) => {
	;(field[y] as string[])[x] = value
}

const directions = {
	north: { x: 0, y: -1, sign: "^" },
	east: { x: 1, y: 0, sign: ">" },
	south: { x: 0, y: 1, sign: "v" },
	west: { x: -1, y: 0, sign: "<" },
}
type Direction = keyof typeof directions
const directionNames = Object.keys(directions) as Direction[]

const startDirection: Direction = "east"
const stepCost = 1
const turn90Cost = 1000
const WALL = "#"
const EMPTY = "."
const START = "S"
const END = "E"

let startX = 0,
	startY = 0
let goalX = 0,
	goalY = 0
for (let y = 0; y < fieldHeight; y++) {
	for (let x = 0; x < fieldWidth; x++) {
		const cell = get(x, y)
		if (cell === START) {
			startX = x
			startY = y
		} else if (cell === END) {
			goalX = x
			goalY = y
		}
	}
}

type Node = {
	x: number
	y: number
	direction: Direction
	cost: number
	minParent: Node | null
	edges: Node[]
}
const nodeToKey = (node: Pick<Node, "x" | "y" | "direction">) =>
	nodeKey(node.x, node.y, node.direction)
const nodeKey = (x: number, y: number, direction: Direction) =>
	`${x},${y},${direction}`
// for adjacent nodes
const edgeCost = (from: Node, to: Node) =>
	from.direction === to.direction ? stepCost : turn90Cost + stepCost
const isGoalNode = (node: Node) => node.x === goalX && node.y === goalY

const nodes = new Map<string, Node>()

// generate all nodes
for (let y = 0; y < fieldHeight; y++) {
	for (let x = 0; x < fieldWidth; x++) {
		const cell = get(x, y)
		if (cell !== WALL) {
			for (const direction of directionNames) {
				const node: Node = {
					x,
					y,
					direction,
					cost: Infinity,
					minParent: null,
					edges: [],
				}
				nodes.set(nodeToKey(node), node)
			}
		}
	}
}

const getNode = (x: number, y: number, direction: Direction) =>
	nodes.get(nodeKey(x, y, direction))

// connect nodes
for (const node of nodes.values()) {
	for (let i = 0; i < 4; i++) {
		const direction = directionNames[i] as Direction

		// step neighbors
		const move = directions[direction]
		const neighbor = getNode(node.x + move.x, node.y + move.y, direction)
		if (neighbor) {
			node.edges.push(neighbor)
		}

		// rotation neighbors
		const clockwise = directionNames[(i + 1) % 4] as Direction
		const neighborClockwise = getNode(node.x, node.y, clockwise) as Node
		node.edges.push(neighborClockwise)

		const counterClockwise = directionNames[(i + 3) % 4] as Direction
		const neighborCounterClockwise = getNode(
			node.x,
			node.y,
			counterClockwise
		) as Node
		node.edges.push(neighborCounterClockwise)
	}
}

const startNode = getNode(startX, startY, startDirection) as Node
startNode.cost = 0
const reachableUnvisited = new PriorityQueue<Node>((a, b) => b.cost - a.cost)
reachableUnvisited.add(startNode)

let goalNode: Node | null = null
while (reachableUnvisited.size) {
	const node = reachableUnvisited.poll() as Node
	if (isGoalNode(node)) {
		goalNode = node
		break
	}

	for (const neighbor of node.edges) {
		const cost = node.cost + edgeCost(node, neighbor)
		if (cost < neighbor.cost) {
			if (!isFinite(neighbor.cost)) {
				reachableUnvisited.add(neighbor)
			}
			neighbor.cost = cost
			neighbor.minParent = node
		}
	}
}

// mark path on field
for (let node = goalNode; node; node = node.minParent) {
	const cell = get(node.x, node.y)
	if (cell !== START && cell !== END) {
		set(node.x, node.y, directions[node.direction].sign)
	}
}

console.log(field.map(line => line.join("")).join("\n"))
console.log(goalNode?.cost)
