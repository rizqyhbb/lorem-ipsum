export interface IInput {
  Buyers: IBuyer[];
  Items: IItem[];
  Transaction: ITransaction[];
}

export interface IBuyer {
  name: string;
  type: 'regular' | 'VIP' | 'wholesale';
}

export interface IItem {
  name: string;
  type: 'hats' | 'tops' | 'shorts';
  prices: IPrice[];
}

export interface IPrice {
  priceFor: 'regular' | 'VIP' | 'wholesale';
  price: number;
}

export interface ITransaction {
  item: string;
  qty: number;
  buyer: string;
}

export interface IRpc {
  category: string;
  revenue: number
}

export interface IBestSpender {
  name: string;
  type: string;
  spent: number;
}