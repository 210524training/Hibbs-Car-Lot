import Car from "../objects/Car";
import Customer from '../objects/Customer';
import Payment from '../objects/Payment';
import Offer from '../objects/Offer';
import DynaDAO from '../objects/DynaDAO';
import Employee from '../objects/Employee';


class CarService{
  constructor(
        public carInventory: Car[] = [],
        public offerInventory: Offer[] = [],
        public PaymentInventory: Payment[] = [],
        public CustomerInventory: Customer[] = [],
        public EmployeeInventory:Employee[]=[],
  ) {}

  Generate_Car_ID():number {
    let max = 0;
    for(let i = 0; i < this.carInventory.length; i++) {
      if(Number(this.carInventory[i].ID) > max) {
        max = Number(this.carInventory[i].ID);
      }
    }
    return (max + 1);
  };
  
  async Put_Car_On_Lot(Model:string, Year:number, InitialPrice:number) {
    const carId = this.Generate_Car_ID();
    const newCar = new Car(carId,"Car",Model,Year,InitialPrice,false,null);
    DynaDAO.add_Car(newCar);
    this.carInventory.push(newCar);
  };
    
  Car_Available_For_Sale(carId:number): boolean {
        let result:boolean=false;
        for(let i = 0; i < this.carInventory.length; i++) {
          if(this.carInventory[i].ID === carId && this.carInventory[i].Purchased !== true) {
            result=true;
          }
        }
        return result;
  };

  Car_Owned_By_You(carID:number,custID:number): boolean {
    let result:boolean=false;
    for(let i = 0; i < this.carInventory.length; i++) {
      if(this.carInventory[i].ID === carID && this.carInventory[i].Purchased == true && this.carInventory[i].OwnerID==custID) {
        result=true;
      }
    }
    return result;
};

  Offer_Exists(offerId:number): boolean {
      let result:boolean=false
      for(let i = 0; i < this.offerInventory.length; i++) {
        if(this.offerInventory[i].ID == offerId && this.offerInventory[i].Status == 'Pending') {
          result=true;
        }
      }      
      return result;
  };

  Generate_Offer_ID():number {
    let max = 0;
    for(let i = 0; i < this.offerInventory.length; i++) {
      if(Number(this.offerInventory[i].ID) > max) {
        max = Number(this.offerInventory[i].ID);
      }
    }
    return Number(max + 1);
  };

  Generate_Customer_ID():number {
    let max = 0;
    for(let i = 0; i < this.CustomerInventory.length; i++) {
      if(Number(this.CustomerInventory[i].ID) > max) {
        max = Number(this.CustomerInventory[i].ID);
      }
    }
    return Number(max + 1);
  };
  Generate_Payment_ID():number {
    let max = 0;
    for(let i = 0; i < this.PaymentInventory.length; i++) {
      if(Number(this.PaymentInventory[i].ID) > max) {
        max = Number(this.PaymentInventory[i].ID);
      }
    }
    return Number(max + 1);
  };

  async Submit_Car_Offer(CustomerID:number, carId:number, OfferAmount:number) {
    const OfferID = this.Generate_Offer_ID();
    const NewOffer = new Offer(OfferID,"Offer",OfferAmount,"Pending",carId,CustomerID);
    DynaDAO.Make_Offer(NewOffer);
    this.offerInventory.push(NewOffer);
  };

  async Reject_Car_Offer(offerId:number) {
    await DynaDAO.Reject_Offer(offerId);
    for(let i = 0; i < this.offerInventory.length; i++) {
      if(this.offerInventory[i].ID === offerId) {
        this.offerInventory[i].Status = 'Rejected';
        break;
      }
    }
  };

  async Make_Owned(carID:number, custID:number) {
    await DynaDAO.Assign_Ownership(carID, custID);
    for(let i = 0; i < this.carInventory.length; i++) {
      if(this.carInventory[i].ID === carID) {
        this.carInventory[i].Purchased = true;
        this.carInventory[i].OwnerID = custID;
        break;
      }
    }
  };
  
  async Pay_Bill(carID:number, custID:number, Amount:number) {
    let paymentID:number=this.Generate_Payment_ID();
    const payment = new Payment(paymentID,"Payment",Amount,custID,carID);
    DynaDAO.Make_Payment(payment);
    this.PaymentInventory.push(payment);
    for(let i=0;i<this.CustomerInventory!.length!;i++){
      if(this.CustomerInventory![i].ID!=custID!){
        this.CustomerInventory![i].Balance!+=Amount!;}
        DynaDAO.Update_Balance(custID!,this.CustomerInventory![i].Balance!)
      }
  };

  async Approve_Offer(offerID:number) {
    let carID :number;
    let custID :number;
    let OfferAmount:number;
    let offers:Offer[];
    for(let i = 0; i < this.offerInventory.length; i++) {
      if(this.offerInventory[i].ID == offerID) {
        offers=this.offerInventory;
        let foundflag=true;
        this.offerInventory[i].Status = 'Approved';
        carID = this.offerInventory[i].CarID;
        custID = this.offerInventory[i].CustomerID;
        OfferAmount = this.offerInventory[i].OfferAmount;
        if(foundflag==true){
          await this.Make_Owned(carID, custID);
          await DynaDAO.Accept_Offer(offerID);
          //await this.Pay_Bill(offerID,carID, custID, OfferAmount);
          for(let i=0;i<this.CustomerInventory!.length;i++){
            if(this.CustomerInventory![i].ID!=custID!){
              this.CustomerInventory![i].Balance!-=OfferAmount!;
              DynaDAO.Update_Balance(custID!,this.CustomerInventory![i].Balance)

            }
          }
        }
        break;
      }
    }
    
  };
  Cust_findByUsername(username: string): Customer | undefined {
    
      return this.CustomerInventory.find((Customer) => Customer.Username === username);
    
  };

  Emp_findByUsername(username: string): Employee | undefined {
    
    return this.EmployeeInventory.find((Employee) => Employee.Username === username);
  
};

Cust_findByID(CustomerID: number): Customer | undefined {
    
  return this.CustomerInventory.find((Customer) => Customer.ID === CustomerID);

};

  logInCustomer(userName: string, password:string): Customer | undefined{
    return this.CustomerInventory.find((Customer) => Customer.Username === userName && Customer.Password === password);
  };

  Log_In_Employee(userName: string, password:string): Employee | undefined{
    return this.EmployeeInventory.find((Employee) => Employee.Username === userName && Employee.Password === password);
  };

  viewCars() {
    for(let i = 0; i < this.carInventory.length; i++) {
      console.log(this.carInventory[i]);
    }
  };

  viewOwnedCars(custID:number) {
    for(let i = 0; i < this.carInventory.length; i++) {
      if(this.carInventory[i].OwnerID == custID) {
        console.log(this.carInventory[i]);
      }
    }
  };

  viewOffers() {
    for(let i = 0; i < this.offerInventory.length; i++) {
      console.log(this.offerInventory[i]);
    }
  };

  viewPayments() {
    for(let i = 0; i < this.PaymentInventory.length; i++) {
      console.log(this.PaymentInventory[i]);
    }
  };
};

export default new CarService();