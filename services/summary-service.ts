import { IBuyer, IInput, IRpc, IBestSpender, IItem, ITransaction } from "../types"
import BuyerService from "./buyer-service"
import ItemService from "./item-service"
import TransactionService from "./transaction-service"

export default class SummaryService {
  buyers: IBuyer[]
  totalTransaction: number
  bestSellingItem: string
  bestSellingCategory: string
  rpc: IRpc[]
  revenue: number
  bestSpenders: IBestSpender[]
  items: IItem[]
  transactions: ITransaction[]


  constructor(public input: IInput) {
    this.totalTransaction = 0
    this.bestSellingItem = ''
    this.bestSellingCategory = ''
    this.rpc = []
    this.revenue = 0
    this.bestSpenders = []
    this.buyers = []
    this.items = []
    this.transactions = []

    this.generate(input)
  }

  generate(input: IInput) {
    const Buyers = new BuyerService(input.Buyers)
    const Transaction = new TransactionService(input.Transaction)
    const Items = new ItemService(input.Items)
    if (!Buyers.errors && !Items.errors) {
      this.buyers = Buyers.buyers
      this.transactions = Transaction.transaction
      this.items = Items.items

      this.totalTransaction = this.transactions.length

      this.bestItem()
      this.print()
    }
  }
  print() {
    console.log({
      totalTransaction: this.totalTransaction,
      bestSellingItem: this.bestSellingItem,
      bestSellingCategory: this.bestSellingCategory
    })
  }

  bestItem() {
    let temp: string[] = []
    this.transactions.map((transaction: any) => {
      for (let i = 0; i < transaction.qty; i++) {
        temp.push(transaction.item)
      }
    });

    const mode = (arr: any) => {
      if (arr.length == 0) {
        return null
      };
      var modeMap: any = {};
      var maxEl = arr[0], maxCount = 1;
      for (var i = 0; i < arr.length; i++) {
        var el = arr[i];
        if (modeMap[el] == null) {
          modeMap[el] = 1;
        } else {
          modeMap[el]++;
        }
        if (modeMap[el] > maxCount) {
          maxEl = el;
          maxCount = modeMap[el];
        }
      }
      return maxEl
    }
    this.bestSellingItem = mode(temp);
    this.items.find((item: IItem) => {
      const result = item.name === this.bestSellingItem
      if (result) {
        this.bestSellingCategory = item.type
      }
    })
  }


}