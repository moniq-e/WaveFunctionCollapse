import { Node } from "./Node.js"
import { Point } from "./Point.js"

const width = 150
const height = 150
const roomSize = 10
const roomsWidth = width / roomSize
const roomsHeight = height / roomSize
const roomsAmount = 40
let rooms = 1

/**
 * @type {Node[][]}
 */
let nodeGrid = []
for (let i = 0; i < roomsHeight; i++) {
    nodeGrid[i] = []
}
/**
 * avaible nodes
 * @type {Node[]}
 */
let nodes = []
let emptyNode
/**
 * positions to collapse
 * @type {Point[]}
 */
let toCollapse = []
/**
 * directions
 * @type {Point[]}
 */
const offsets = [
    new Point(0, -1), //top
    new Point(0, 1), //bottom
    new Point(1, 0), //right
    new Point(-1, 0), //left
]

const offsetLetter = [
    "U",
    "D",
    "R",
    "L"
]

register()

let date = Date.now()
console.log("started")
collapse()
console.log(`finished in: ${Date.now() - date} ms with ${rooms} rooms`)
show()

function collapse() {
    toCollapse.push(new Point(roomsWidth / 2, roomsHeight / 2))
    var initial = true

    while (toCollapse.length > 0) {
        let atual = toCollapse.shift()
        if (nodeGrid[atual.y][atual.x] != null) continue
        /**
         * nodes that can be used to collapse
         * @type {Node[]}
         */
        let potentialNodes = [...nodes]
        let name = []
        let restrictiveName = []

        for (let i = 0; i < offsets.length; i++) {
            
            let neighbour = new Point(atual.x + offsets[i].x, atual.y + offsets[i].y)

            if (isInside(neighbour)) {
                let neighbourNode = nodeGrid[neighbour.y][neighbour.x]

                if (neighbourNode != null) {
                    if (neighbourNode == emptyNode) addRestritivo(i, restrictiveName)
                    switch (i) {
                        case 0:
                            if (neighbourNode.name.includes("D")) name.push("U")
                            else addRestritivo(i, restrictiveName)
                            break
                        case 1:
                            if (neighbourNode.name.includes("U")) name.push("D")
                            else addRestritivo(i, restrictiveName)
                            break
                        case 2:
                            if (neighbourNode.name.includes("L")) name.push("R")
                            else addRestritivo(i, restrictiveName)
                            break
                        case 3:
                            if (neighbourNode.name.includes("R")) name.push("L")
                            else addRestritivo(i, restrictiveName)
                            break
                    }
                } else if (!toCollapse.includes(neighbour)) {
                    toCollapse.push(neighbour)
                }
            } else {
                addRestritivo(i, restrictiveName)
            }
        }

        apenasCompativeis(potentialNodes, name, restrictiveName)

        if (potentialNodes.length <= 0) {

            if (initial) {
                /**
                 * @type {Node}
                 */
                let rndNode = Object.assign(Object.create(Node.prototype), nodes[rn(nodes.length)])
                nodeGrid[atual.y][atual.x] = rndNode
                let split = rndNode.sprite.split("")
                split[5] = "*"
                rndNode.sprite = split.join("")
                initial = false
            } else {
                nodeGrid[atual.y][atual.x] = emptyNode
            }

        } else {
            let random

            if (rooms < roomsAmount) {
                potentialNodes.sort((a, b) => b.name.length - a.name.length)
                random = rn(Math.ceil(potentialNodes.length / 2))
            } else {
                potentialNodes.sort((a, b) => a.name.length - b.name.length)
                random = 0
            }

            rooms++
            nodeGrid[atual.y][atual.x] = potentialNodes[random]
        }
    }
}

function show() {
    for (let x = 0; x < nodeGrid.length; x++) {
        let line1 = ""
        let line2 = ""
        let line3 = ""

        for (let y = 0; y < nodeGrid[x].length; y++) {
            const nodeSpriteSplitted = nodeGrid[x][y].sprite.split("\n")

            line1 += nodeSpriteSplitted[0]
            line2 += nodeSpriteSplitted[1]
            line3 += nodeSpriteSplitted[2]
        }

        console.log(line1)
        console.log(line2)
        console.log(line3)
    }
}

/**
 * @param {Node[]} potentialNodes 
 * @param {string[]} name 
 * @param {string[]} restrictiveName
 */
function apenasCompativeis(potentialNodes, name, restrictiveName) {
    if (name.length == 0) return potentialNodes.splice(0, potentialNodes.length)

    for (let i = potentialNodes.length - 1; i >= 0; --i) {
        //checa pra todas as letras se o nome do node às contém
        let includes = name.every(v => potentialNodes[i].name.includes(v))
        let excludes = restrictiveName.some(v => potentialNodes[i].name.includes(v))
        if (!includes || excludes) {
            potentialNodes.splice(i, 1)
        }
    }
}

/**
 * checa se um ponto ta na grid
 * @param {Point} point 
 */
function isInside(point) {
    if (point.x >= 0 && point.x < roomsWidth && point.y >= 0 && point.y < roomsHeight) {
        return true
    }
    return false
}

/**
 * @param {number} i 
 * @param {string[]} nomeRestritivo 
 */
function addRestritivo(i, nomeRestritivo) {
    nomeRestritivo.push(offsetLetter[i])
}

function register() {
    emptyNode = new Node("", "ooo\nooo\nooo")
    nodes.push(new Node("U", "o⬆o\no o\nooo"))
    nodes.push(new Node("D", "ooo\no o\no⬇o"))
    nodes.push(new Node("L", "ooo\n⬅ o\nooo"))
    nodes.push(new Node("R", "ooo\no ➡️\nooo"))
    nodes.push(new Node("UD", "o⬆o\no o\no⬇o"))
    nodes.push(new Node("UL", "o⬆o\n⬅ o\nooo"))
    nodes.push(new Node("UR", "o⬆o\no ➡️\nooo"))
    nodes.push(new Node("ULR", "o⬆o\n⬅ ➡️\nooo"))
    nodes.push(new Node("UDL", "o⬆o\n⬅ o\no⬇o"))
    nodes.push(new Node("UDR", "o⬆o\no ➡️\no⬇o"))
    nodes.push(new Node("UDLR", "o⬆o\n⬅ ➡️\no⬇o"))
    nodes.push(new Node("DL", "ooo\n⬅ o\no⬇o"))
    nodes.push(new Node("DR", "ooo\no ➡️\no⬇o"))
    nodes.push(new Node("DLR", "ooo\n⬅ ➡️\no⬇o"))
    nodes.push(new Node("LR", "ooo\n⬅ ➡️\nooo"))
}

function rn(max, min = 0) {
    return Math.floor((Math.random() * max) + min)
}