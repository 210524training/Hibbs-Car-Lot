import User from "./User";

export default class Employee extends User {
    constructor(
        public ID: number,
        public Type: "Employee",
        public Username: string,
        public Password: string,               
    ) {
        super(ID,Type,Username,Password);
    }
  };