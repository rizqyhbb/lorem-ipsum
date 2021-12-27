import Transaction from "../models/transaction"
import { ITransaction } from "../types"

export default class TransactionService {
  transaction: ITransaction[]
  constructor(transaction: ITransaction[]) {
    this.transaction = []
    this.generate(transaction)
  }
  generate(transaction: ITransaction[]) {
    for (let trx of transaction) {
      this.transaction.push(new Transaction(trx.item, trx.qty, trx.buyer))
    }
  }
}