import { IItem, IPrice } from "../types"
import Item from "../models/item"

export default class ItemService {
  items: IItem[]
  errors: boolean

  constructor(items: IItem[]) {
    this.items = []
    this.errors = false
    this.generate(items)
  }
  generate(items: IItem[]) {
    for (let item of items) {
      const duplicate = this.items.find((el: IItem) => el.name === item.name)
      const typeCheck = item.prices.filter((price: IPrice) => price.priceFor === 'regular').length < 1
      if (typeCheck) {
        this.errors = true
        console.log(`${item.name} has no regular price`)
      }
      if (duplicate) {
        this.errors = true
        console.log(`${duplicate.name} is not unique`)
      }
      if (!duplicate && !typeCheck) {
        this.items.push(new Item(item.name, item.type, item.prices))
      }

    }
  }
} 