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
        public paymentInv: Payment[] = [],
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

  async Make_Owned(carId:number, custId:number) {
    await DynaDAO.Assign_Ownership(carId, custId);
    for(let i = 0; i < this.carInventory.length; i++) {
      if(this.carInventory[i].ID === carId) {
        this.carInventory[i].Purchased = true;
        this.carInventory[i].OwnerID = custId;
        break;
      }
    }
  };
  
  async Pay_Bill(paymentId: number,carId:number, custId:number, Amount:number) {
    const CurrentDate=new Date();
    const payment = new Payment(paymentId,"Payment",CurrentDate,Amount,custId,carId);
    DynaDAO.Make_Payment(payment);
    this.paymentInv.push(payment);
  };

  async Approve_Offer(offerId:number) {
    let carId :number;
    let custId :number;
    let OfferAmount:number;
    let date :Date;
    let offers:Offer[];
    for(let i = 0; i < this.offerInventory.length; i++) {
      if(this.offerInventory[i].ID == offerId) {
        offers=this.offerInventory;
        let foundflag=true;
        this.offerInventory[i].Status = 'Approved';
        carId = this.offerInventory[i].CarID;
        
        custId = this.offerInventory[i].CustomerID;
        OfferAmount = this.offerInventory[i].OfferAmount;
        if(foundflag==true){
          await this.Make_Owned(carId, custId);
          await DynaDAO.Accept_Offer(offerId);
          await this.Pay_Bill(offerId,carId, custId, OfferAmount);
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

  viewOwnedCars(custId:number) {
    for(let i = 0; i < this.carInventory.length; i++) {
      if(this.carInventory[i].OwnerID === custId) {
        console.log(this.carInventory[i]);
      }
    }
  };

  viewOffers() {
    for(let i = 0; i < this.offerInventory.length; i++) {
      console.log(this.offerInventory[i]);
      console.log(this.offerInventory[i].ID);
      console.log(this.offerInventory[i].CarID);
      console.log(this.offerInventory[i].CustomerID);
    }
  };

  viewPayments() {
    for(let i = 0; i < this.paymentInv.length; i++) {
      console.log(this.paymentInv[i]);
    }
  };
};

export default new CarService();