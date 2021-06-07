import tableitem from './Tableitem';

export default class Offer extends tableitem {
    constructor(
        public ID:number,
        public Type:"Offer",
        public Date:Date,
        public OfferAmount:number,
        public Status:string="Pending",
        public CarID:number,
        public CustomerID:number
    ) {
        super(ID,Type);
    }
  };