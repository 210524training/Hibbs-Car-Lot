import User from "./User";

export default class Customer extends User {
    constructor(
        public ID: number,
        public Type: "Customer",
        public Username: string,
        public Password: string,
        public Balance: number | null     
    ) {
        super(ID,Type,Username,Password);
    }
  };