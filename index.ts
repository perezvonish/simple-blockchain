const sha256 = require('crypto-js/sha256');

class Block {
    index: any;
    timestamp: Date;
    data: any;
    previousHash: string
    hash: string

    constructor(index: any, timestamp: Date, data: any, previousHash = "") {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
    }

    calculateHash() {
        return sha256(this.index + this.timestamp + JSON.stringify(this.data)).toString()
    }
}

class Blockchain {
    chain: any[]

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
        newBlock.hash = newBlock.calculateHash()
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

perezCoin.addBlock(new Block(1, new Date, {amount: 1}))
perezCoin.addBlock(new Block(2, new Date, {amount: 15}))
perezCoin.addBlock(new Block(3, new Date, {amount: 14}))

console.log(perezCoin.isValid())