const sha256 = require('crypto-js/sha256');

class Transaction {
    fromAddress: any
    toAddress: any
    amount: number

    constructor(fromAddress: any, toAddress: any, amount: number) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

class Block {
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
}

class Blockchain {
    chain: any[]
    difficulty: number = 1
    pendingTransactions: any[] = []
    miningReward: number = 100

    constructor() {
        this.chain = [this.createGenesisBlock()]
    }

    createGenesisBlock() {
        return new Block(new Date, "Genesis block", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    minePendingTransaction(miningRewardAddress: any) {
        const block = new Block(new Date, this.pendingTransactions)
        block.mineBlock(this.difficulty)


        this.chain.push(block)
        return this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    createTransaction(transaction: Transaction) {
        return this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address: any) {
        let balance = 0;

        for (const block of this.chain){
            for (const trans of block.transactions){
                if (trans.fromAddress == address){
                    balance -= trans.amount
                }

                if (trans.toAddress == address){
                    balance += trans.amount
                }
            }
        }

        return balance
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


console.log("Balance of 1 --> ", perezCoin.getBalanceOfAddress("1"))

perezCoin.createTransaction(new Transaction("2", "1", 50))
perezCoin.minePendingTransaction("1")

console.log("Balance of 1 --> ", perezCoin.getBalanceOfAddress("2"))