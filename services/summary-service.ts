import { IBuyer, IInput, IRpc, IBestSpender, IItem, ITransaction, IPrice } from "../types"
import BuyerService from "./buyer-service"
import ItemService from "./item-service"
import TransactionService from "./transaction-service"

let fs = require('fs');

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

      this.assignNewProps()
      this.bestItem()
      this.revenuePerCat()
      this.calculateRevenue()
      this.findBestSpenders()
      this.print()
      this.printJson()
    }
  }
  print() {
    console.log({
      "Summary": {
        totalTransaction: this.totalTransaction,
        bestSellingItem: this.bestSellingItem,
        bestSellingCategory: this.bestSellingCategory,
        rpc: this.rpc,
        revenue: this.revenue,
        bestSpenders: this.bestSpenders
      }
    }
    )
  }

  printJson() {
    fs.unlink('output.json', function (err: any) {
      if (err) throw err;
      console.log('File deleted!');
    });
    fs.appendFile('output.json', JSON.stringify(
      {
        "Summary": {
          totalTransaction: this.totalTransaction,
          bestSellingItem: this.bestSellingItem,
          bestSellingCategory: this.bestSellingCategory,
          rpc: this.rpc,
          revenue: this.revenue,
          bestSpenders: this.bestSpenders
        }
      }, null, 4
    ), function (err: any) {
      if (err) throw err;
      console.log('Saved!');
    });
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

  assignNewProps() {
    this.transactions.forEach((transaction: ITransaction) => {
      const buyerType = this.buyers.find((buyer: IBuyer) => buyer.name === transaction.buyer)?.type;
      const itemDesc = this.items.find((item: IItem) => item.name === transaction.item)
      const matchedPrice = itemDesc?.prices.find((price: IPrice) => price.priceFor === buyerType)
      const regularPrice = itemDesc?.prices.find((price: IPrice) => price.priceFor === 'regular')

      transaction.type = buyerType
      transaction.category = itemDesc?.type
      if (matchedPrice) {
        transaction.priceFor = matchedPrice.priceFor,
          transaction.price = matchedPrice.price
      } else {
        transaction.priceFor = regularPrice?.priceFor || "regular",
          transaction.price = regularPrice?.price || 0
      }
    })
  }

  revenuePerCat() {
    let tempHats: any = []
    let tempTops: any = []
    let tempShorts: any = []
    const reducer = (prevValue: number, currentValue: number) => prevValue + currentValue
    this.transactions.forEach((transaction: ITransaction) => {
      const hats = transaction.category === 'hats'
      const tops = transaction.category === 'tops'
      const shorts = transaction.category === 'shorts'
      if (hats) {
        tempHats.push(transaction.price! * transaction.qty)
      }
      if (tops) {
        tempTops.push(transaction.price! * transaction.qty)
      }
      if (shorts) {
        tempShorts.push(transaction.price! * transaction.qty)
      }
    });

    this.rpc.push({
      category: 'hats',
      revenue: tempHats.length ? tempHats.reduce(reducer) : 0
    },
      {
        category: 'tops',
        revenue: tempTops.length ? tempTops.reduce(reducer) : 0
      },
      {
        category: 'shorts',
        revenue: tempShorts.length ? tempShorts.reduce(reducer) : 0
      })
  }

  calculateRevenue() {
    let temp: any = []
    const reducer = (prevValue: number, currentValue: number) => prevValue + currentValue
    this.rpc.forEach((e: any) => {
      temp.push(e.revenue)
    });
    this.revenue = (temp.reduce(reducer))
  }

  findBestSpenders() {
    let results: IBestSpender[] = [];

    this.transactions.forEach((transaction, index) => {
      let buyerExists = false;

      if (index === 0) {
        results.push({
          name: transaction.buyer,
          type: transaction.type || 'regular',
          spent: transaction.qty * transaction.price!,
        });
      } else {
        /* check if item exists in results */
        for (let result of results) {
          if (result.name === transaction.buyer) {
            buyerExists = true;
          }
        }
        /* */

        if (buyerExists) {
          let trxIndex = results.findIndex((el) => el.name === transaction.buyer);
          results[trxIndex].spent += transaction.qty * transaction.price!;
        } else {
          results.push({
            name: transaction.buyer,
            type: transaction.type || 'regular',
            spent: transaction.qty * transaction.price!,
          });
        }
      }
    });

    this.bestSpenders = results.sort((a, b) => b.spent - a.spent)

  };

}

