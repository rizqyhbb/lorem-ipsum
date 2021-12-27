class Transaction {
  constructor(public item: string, public qty: number, public buyer: string){
    this.item = item
    this.qty = qty
    this.buyer = buyer
  }
}

export default Transaction;
