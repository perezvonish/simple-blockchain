const SHA256 = require('crypto-js/sha256');
import { ec as EC } from 'elliptic';
const ec = new EC('secp256k1');


export class Transaction {
    fromAddress: any
    toAddress: any
    amount: number
    signature: any

    constructor(fromAddress: any, toAddress: any, amount: number) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey: any) {
        if (signingKey.getPublic("hex") !== this.fromAddress){
            throw new Error("Can not sign transactions for other wallets")
        }

        const hashTx = this.calculateHash()
        const sig = signingKey.sign(hashTx, "base64")
        this.signature = sig.toDER("hex")
    }

    isValid() {
        if (this.fromAddress == null) return true

        if (!this.signature || this.signature === undefined){
            throw new Error("No signature in this transaction.")
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, "hex")
        return publicKey.verify(this.calculateHash(), this.signature)
    }
}