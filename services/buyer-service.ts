import { IBuyer } from "../types";
import Buyer from "../models/buyer";

export default class BuyerService {
  buyers: IBuyer[]
  errors: boolean
  constructor(buyers: IBuyer[]) {
    this.buyers = []
    this.errors = false
    this.uniqueCheck(buyers)
  }
  uniqueCheck(buyers: IBuyer[]) {
    for (let buyer of buyers) {
      const duplicate = this.buyers.find((el: IBuyer) => el.name === buyer.name)
      if (duplicate) {
        this.errors = true
        console.log(`${duplicate.name} is not unique`)
      } else {
        this.buyers.push(new Buyer(buyer.name, buyer.type))
      }
    }
  }
}