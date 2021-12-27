interface IPrice {
  priceFor: 'regular' | 'VIP' | 'wholesale';
  price: number
}

class Item {
  constructor(public name:string, public type: 'hats' | 'tops' | 'shorts', public prices: IPrice[]) {
    this.name = name
    this.type = type
    this.prices = prices
  }
}

export default Item;