import tableitem from './Tableitem';

export default class Payment extends tableitem {
    constructor(
        public ID: number,
        public Type:"Payment",
        public Amount: number,
        public CustomerID:number,
        public CarID: Number
    ) {
        super(ID,Type,)
    }
  };