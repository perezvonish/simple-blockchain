const sha256 = require('crypto-js/sha256');

class Block {
    index: any;
    timestamp: Date;
    data: any;
    previousHash: string
    hash: string
    nonce: number

    constructor(index: any, timestamp: Date, data: any, previousHash = "") {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash() {
        return sha256(this.index + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty: number) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++
            this.hash = this.calculateHash()
        }

        console.log(`Block mined: ${this.hash}`)
    }
}

class Blockchain {
    chain: any[]
    difficulty: number = 5

    constructor() {
        this.chain = [this.createGenesisBlock()]
    }

    createGenesisBlock() {
        return new Block(0, new Date, "Genesis block", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock: Block) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.mineBlock(this.difficulty)
        return this.chain.push(newBlock)
    }

    isValid() {
        for (let i = 1; i < this.chain.length; i++){
            const curBlock = this.chain[i]
            const prevBlock = this.chain[i - 1]

            if (curBlock.hash !== curBlock.calculateHash()){
                return false
            }

            if (curBlock.previousHash !== prevBlock.hash){
                return false
            }
        }

        return true
    }
}

const perezCoin = new Blockchain()

console.log("Mine 1")
console.log(process.uptime())
perezCoin.addBlock(new Block(1, new Date, {amount: 1}))
console.log(process.uptime())

console.log("Mine 1")
perezCoin.addBlock(new Block(2, new Date, {amount: 15}))
process.uptime()

console.log("Mine 1")
perezCoin.addBlock(new Block(3, new Date, {amount: 14}))
process.uptime()

console.log(perezCoin.isValid())