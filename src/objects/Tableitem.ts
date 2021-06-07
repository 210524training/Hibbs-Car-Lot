export default class TableItem {
    constructor(
        public ID: number,
        public Type: "Car" | "Customer" | "Employee" | "Payment" | "Offer",
    ) {}
  };