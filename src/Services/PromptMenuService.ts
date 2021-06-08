import readline from 'readline';
import Customer from '../objects/Customer';
import DynaDAO from '../objects/DynaDAO';
import log from '../objects/log';
import CarService from './CarService';

export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  

  
  function exit() {
    rl.close();
    process.exit(0);
};

const currentUser: Customer | undefined = undefined;

export function initialPrompt(): Promise<string> {
    return new Promise<string>(
      (resolve) => {
        rl.question(
          `
  _______Welcome to a generic non-existant Car Dealership ______
  0. Register as New Customer
  1. Login
  e. Exit
  ______________________________________________________________\n`,
          (answer) => {
            let valid = false;
            if((!Number.isNaN(Number(answer)) && (Number(answer) <= 1) && (Number(answer) >= 0)) || (answer === 'e')) {
              valid = true;
            }
            if(valid) {
              resolve(answer);
            } else {
              log.warn('Invalid Input');
              exit();
            }
          },
        );
      },
    );
};

export function customerPrompt(): Promise<string> {
    return new Promise<string>(
      (resolve) => {
        rl.question(
          `\n
    ____________________      
    0. View cars.
    1. Make offer.
    2. View my cars.
    3. Make Payment.
    4. View Balance.
    e. Exit
    ____________________
  `,
          (answer) => {
            if((!Number.isNaN(Number(answer)) && (Number(answer) <= 3) && (Number(answer) >= 0)) || (answer === 'e')) {
              resolve(answer);
            } else {
              resolve('false');
            }
          },
        );
      },
    );
};

export function employeePrompt(): Promise<string> {
    return new Promise<string>(
      (resolve) => {
        rl.question(
          `\n
  ________________________________________        
  <<<<<<<<<<<<<<<< Cars >>>>>>>>>>>>>>>>>>
  0. Add a car to lot.
  r. Remove a car from the lot.
  <<<<<<<<<<<<<<< Offers >>>>>>>>>>>>>>>>>
  1. View offers.
  2. Accept pending offers.
  3. Reject pending offers.
  <<<<<<<<<<<<<<< Payment >>>>>>>>>>>>>>>>
  4. View payments.
  e. Exit
  ________________________________________
  `,
          (answer) => {
            if((!Number.isNaN(Number(answer)) && (Number(answer) <= 4) && (Number(answer) >= 0)) || (answer === 'e')) {
              resolve(answer);
            } else {
              log.warn('Invalid Input');
              resolve('false');
            }
          },
        );
      },
    );
};

export function Customer_Select_Car_For_Offer(): Promise<number> {
    return new Promise<number>(
      (resolve) => {
        rl.question('Which car would you like to bid on? (Car ID)',
          (answer) => {
            if(CarService.Car_Available_For_Sale(parseInt(answer))) {
              resolve(parseInt(answer));
            } else {
              log.warn('The car is already taken or not available');
            }
          });
      },
    );
};

export function Customer_Select_Car_For_Payment(custID:number): Promise<number> {
  return new Promise<number>(
    (resolve) => {
      rl.question('Which car would you like to pay off? (Car ID)',
        (answer) => {
          if(CarService.Car_Owned_By_You(parseInt(answer),custID)) {
            resolve(parseInt(answer));
          } else {
            log.warn('That is not your car');
          }
        });
    },
  );
};

export function Customer_Select_Payment_Amount(custID:number): Promise<number> {
  return new Promise<number>(
    (resolve) => {
      rl.question('How much would you like to pay?',
        (answer) => {
          if(CarService.Car_Owned_By_You(parseFloat(answer),custID)) {
            resolve(parseFloat(answer));
          } else {
            log.warn('The car is already taken or not available');
          }
        });
    },
  );
};

export function askOfferId(): Promise<number> {
    return new Promise<number>(
      (resolve) => {
        rl.question('What is the offer ID?',
          (answer) => {
            let numanswer=parseInt(answer)
            if(CarService.Offer_Exists(numanswer)) {
              resolve(numanswer);
            } else {
              log.warn('The offer ID does not exist or the status is not pending');
              console.log('The offer ID does not exist or the status is not pending')
              exit();
            }
          });
      },
    );
};

export function Customer_Choose_Offer(): Promise<number> {
    return new Promise<number>(
      (resolve) => {
        rl.question('How much would you like to offer?',
          (answer) => {
            if(!Number.isNaN(Number(answer)) && (Number(answer) >= 0)) {
              resolve(parseInt(answer));
            } else {
              log.warn('Invalid Input');
            }
          });
      },
    );
};

export async function rejectOfferPrompt() {
  let offerId: number;
    while(true) {
      offerId = await askOfferId();
      if(offerId){
        await CarService.Reject_Car_Offer(offerId);
        break;
      }
    }
};
  
export async function approveOfferPrompt() {
  let offerId: number;
    while(true) {
      offerId = await askOfferId();
      if(offerId){        
        await CarService.Approve_Offer(offerId);
                
        break;
      }
    }
};

export function Customer_Submit_ID(): Promise<number> {
    return new Promise<number>(
      (resolve) => {
        rl.question('Confirm ID',
          (answer) => {
            if(!Number.isNaN(Number(answer)) && (Number(answer) >= 0)) {
              resolve(parseInt(answer));
            } else {
              log.warn('Invalid Input');
            }
          });
      },
    );
};

export function Emlpoyee_Delete_Car(): Promise<number> {
  return new Promise<number>(
    (resolve) => {
      rl.question('What car do you want to remove?',
        (answer) => {
          if(!Number.isNaN(Number(answer)) && (Number(answer) >= 0)) {
            resolve(parseInt(answer));
          } else {
            log.warn('Invalid Input');
          }
        });
    },
  );
};

export async function makeOffer(): Promise<void> {
    let valid = false;
    let CarID:number = await Customer_Select_Car_For_Offer();
    let OfferAmount:number = await Customer_Choose_Offer();
    let CustomerID:number= await Customer_Submit_ID();
    while(!valid) {
     
      if(!CarID) continue;
      
      if(!OfferAmount) continue;
      valid = true;
    }
    if(CustomerID !== undefined) {
      await CarService.Submit_Car_Offer(CustomerID,CarID,OfferAmount);
    } else {
      throw new Error('Undefined Customer.');
    }
};

export function askCarModel(): Promise<string> {
    return new Promise<string>(
      (resolve) => {
        rl.question('What is the model of the car?',
          (answer) => {
            if(answer === '') {
              resolve('false');
            }
            resolve(answer);
          });
      },
    );
};
  
export function askCarYear(): Promise<number> {
    return new Promise<number>(
      (resolve) => {
        rl.question('What is the year?',
          (answer) => {
            if(parseInt(answer)) {
              resolve(parseInt(answer));
            } else {
              log.warn('Invalid Input');
              console.log('Invalid Input');
            }
          });
      },
    );
};
  
export function askCarPrice(): Promise<number> {
    return new Promise<number>(
      (resolve) => {
        rl.question('What is the price?',
          (answer) => {
            if(!answer) {
              log.warn('Invalid Input');
              console.log('Invalid Input');
            }else if(!Number.isNaN(Number(answer))) {
              resolve(parseInt(answer));
            } else {
              log.warn('Invalid Input');
              console.log('Invalid Input');
            }
          });
      },
    );
};
  
export async function addCarPrompt() {
    let model: string;
    let year: number;
    let price: number;
    while(true) {
      model = await askCarModel();
      year = await askCarYear();
      price = await askCarPrice();
      if(year && price) {
        break;
      }
    }
    CarService.Put_Car_On_Lot(model, year, Number(price));
};
  
export function askCarId(): Promise<number> {
    return new Promise<number>(
      (resolve) => {
        rl.question('What is the car ID of the car?',
          (answer) => {
            resolve(parseInt(answer));
          });
      },
    );
};
  
export async function deleteCarPrompt() {
    let valid = false;
    let carId:number=await askCarId();
    if(CarService.Car_Available_For_Sale(carId)) {
        valid = true;
      } else {
        log.warn('Car is either owned or does not exist');
      }

};

export function queryUsername(): Promise<string> {
    return new Promise<string>(
      (resolve) => {
        rl.question(
          'What is your username? ',
          (answer) => resolve(answer),
        );
      },
    );
};
  
export function confirmPassword(password: string): Promise<boolean> {
    return new Promise<boolean>(
      (resolve) => {
        rl.question(
          'Please confirm your password: ',
          (answer) => resolve(answer === password),
        );
      },
    );
};
  
export async function getPassword(): Promise<string> {
    const password = await new Promise<string>(
      (resolve) => {
        rl.question(
          'What is your password? ',
          (answer) => resolve(answer),
        );
      },
    );
    return password;
};
  
export async function queryPassword(): Promise<string> {
    const password = await getPassword();
    if(await confirmPassword(password)) {
      
      return password;
    }
    console.log('Passwords did not match');
    throw new Error('Promise did not match');
};
  
export async function attemptRegister(): Promise<void> {
    const username = await queryUsername();
    if(CarService.Cust_findByUsername(username)) {
      console.log('The provided username is already taken');
      throw new Error('Username already taken');
    }
    const password = await queryPassword();
    let ID=CarService.Generate_Customer_ID();
    let newCustomer: Customer=new Customer(ID,"Customer",username,password,0)
    await DynaDAO.register(newCustomer);
    CarService.CustomerInventory.push(newCustomer);
    await loadData();
    
};

export async function login() {
    const username = await queryUsername();
    if(CarService.Cust_findByUsername(username) === undefined) {
      if(CarService.Emp_findByUsername(username) === undefined){
      throw new Error('The username does not exit.');
    }}
    const password = await getPassword();
    const loggedInCust = CarService.logInCustomer(username, password);
    const loggedInEmp=CarService.Log_In_Employee(username,password);
    if(loggedInCust !== undefined && loggedInCust.Type === 'Customer' ) {
        let CustomerID = loggedInCust!.ID;
        console.log(`Your ID is ${CustomerID}`);
        await recievedCustInput(CustomerID);
      } else if(loggedInEmp!==undefined && loggedInEmp.Type === 'Employee') {
        await recievedEmployInput();
      }
     else {
      throw new Error('Username and password do not match.');
    }
};

export async function recievedCustInput(CustomerID:number) {
    while(true) {
      // eslint-disable-next-line prefer-const
      let answer = await customerPrompt();
      switch (answer) {
      case '0':
        CarService.viewCars();
        break;
      case '1':
        await makeOffer();
        break;
      case '2':
        CarService.viewOwnedCars(CustomerID);
        break;
      case '3':
        let carID:number= await Customer_Select_Car_For_Payment(CustomerID);
        let Amount:number= await await Customer_Select_Car_For_Payment(CustomerID);
        CarService.Pay_Bill(carID, CustomerID, Amount)
        break;
      case '4':
        for(let i=0;i<CarService.CustomerInventory!.length;i++){
          if(CarService.CustomerInventory![i].ID!=CustomerID!){
            console.log("Your balance is: $"+CarService.CustomerInventory[i].Balance);
          }}
        break;
      case 'false':
        log.warn('Invalid Input');
        break;
      default:
        exit();
      }
    }
};
  
export async function recievedEmployInput() {
    while(true) {
      // eslint-disable-next-line prefer-const
      let answer = await employeePrompt();
      switch (answer) {
      case '0':
        let Model= await askCarModel();
        let Year= await askCarYear();
        let Price=await askCarPrice();
        CarService.Put_Car_On_Lot(Model,Year,Price);
        break;
      case '1':
        CarService.viewOffers();
        break;
      case 'r':
        let carID= await Emlpoyee_Delete_Car();
        CarService.Deleted_Car_From_Lot(carID);
        break;
      case '2':
        await approveOfferPrompt();
        break;
      case '3':
        await rejectOfferPrompt();
        break;
      case '4':
        CarService.viewPayments();
        break;
      default:
        exit();
      }
    }
};
  

  
async function receiveUserSelection(): Promise<void> {
    let response: string;
    if(!currentUser) {
      response = await initialPrompt();
      switch (response) {
      case '0':
        await attemptRegister();
        break;
      case '1':
        await login();
        break;
      default:
        exit();
      }
    }
    
};
  
export async function loadData(): Promise<String> {
    CarService.CustomerInventory = await DynaDAO.getAllCustomers();
    CarService.carInventory = await DynaDAO.getAllCars();
    CarService.EmployeeInventory=await DynaDAO.getAllEmployees();
    CarService.offerInventory = await DynaDAO.getAllOffers();    
    CarService.PaymentInventory = await DynaDAO.getAllPayments();
    
    return 'good';
};
  
export async function RunScript() {
    await loadData();
    while(true) {
      try {
        await receiveUserSelection();
      // eslint-disable-next-line no-empty
      } catch(error) {
        console.log(error);
      }
    }
};
  