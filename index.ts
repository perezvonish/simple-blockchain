import {Blockchain} from "./src/blockchain";
import {Transaction} from "./src/transaction";
import { ec as EC } from 'elliptic';
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate("298d263f63694f5d15ff865fc665fafd2023855378cceeef57aecf8ce56ee2ce")
const myWallet = myKey.getPublic("hex")

const perezCoin = new Blockchain()

const tx1 = new Transaction(myWallet, "public key goes here", 100)
tx1.signTransaction(myKey)

perezCoin.addTransaction(tx1)
perezCoin.minePendingTransaction(myWallet)


console.log(`Balance of myhWallet --> `, perezCoin.getBalanceOfAddress(myWallet))
console.log(`Is chain valid? --> ${perezCoin.isValid()}`)

console.log(perezCoin)