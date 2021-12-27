class Buyer {
  constructor(public name: string, public type: 'regular' | 'VIP' | 'wholesale') {
    this.name = name
    this.type = type
  }
}

export default Buyer;