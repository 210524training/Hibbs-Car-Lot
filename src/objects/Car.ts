import TableItem from "./Tableitem";

export default class Car extends TableItem {
    constructor(
        public ID: number,
        public Type: "Car",
        public Model: string,
        public Year: number,
        public InitialPrice: number,
        public Purchased: boolean,
        public OwnerID: null | number
    ) {
        super(ID,Type);
    }
  };