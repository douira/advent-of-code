const fs = require("fs")
const path = require("path")

const input = fs.readFileSync(path.join(__dirname, "input")).toString()

const largest = new Set()
let smallestLargest = -1
let currentSum = 0

input
  .split("\n")
  .map(l => parseInt(l, 10))
  .filter(n => {
    if (isNaN(n)) {
      if (currentSum > smallestLargest) {
        largest.add(currentSum)
        if (largest.size > 3) {
          largest.delete(smallestLargest)
        }
        smallestLargest = Math.min(...largest)
      }
      currentSum = 0
    } else {
      currentSum += n
    }
  })

console.log(largest)

// sum of the 3 largest
console.log([...largest].reduce((a, b) => a + b, 0))
