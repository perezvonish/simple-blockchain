const sha256 = require('crypto-js/sha256');

export class Block {
    timestamp: Date;
    transactions: any;
    previousHash: string
    hash: string;
    nonce: number

    constructor(timestamp: Date, transactions: any, previousHash = "") {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash() {
        return sha256(this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
    }

    mineBlock(difficulty: number) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++
            this.hash = this.calculateHash()
        }

        console.log(`Block mined: ${this.hash}`)
    }

    hasValidTransaction() {
        for (const tx of this.transactions){
            if (!tx.isValid()){
                return false
            }
        }

        return true
    }
}