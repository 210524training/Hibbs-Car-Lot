import TableItem from "./Tableitem";

export default class User extends TableItem {
    constructor(
        public ID: number,
        public Type: "Customer" | "Employee",
        public Username: string,
        public Password: string
    ) {
        super(ID,Type,);
    }
  };