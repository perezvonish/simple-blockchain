import {Block} from "./block";
import {Transaction} from "./transaction";

export class Blockchain {
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
        const block = new Block(new Date, this.pendingTransactions, this.getLatestBlock().hash)
        block.mineBlock(this.difficulty)


        this.chain.push(block)
        return this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    addTransaction(transaction: Transaction) {
        if (!transaction.fromAddress || !transaction.toAddress){
            throw new Error("Transaction have to include from and to address")
        }

        if (!transaction.isValid()){
            throw new Error("Can not add invalid transaction to chain")
        }

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

            if (curBlock.hasValidTransaction()){
                return false
            }

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