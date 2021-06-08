import { DocumentClient } from "aws-sdk/clients/dynamodb";
import myDocClient from "./DocClient";
import log from "./log";
import Car from "./Car";
import Customer from './Customer';
import Payment from './Payment';
import Offer from './Offer';
import Employee from './Employee';

class DynaDAO {
  constructor(
      private DocClient: DocumentClient= myDocClient,
  ) {}
  async add_Car(newCar:Car) {
        const params = {
          TableName: 'Car-Lot',
          Item: {
            Type: 'Car',
            ID: newCar.ID,
            Model: newCar.Model,
            Year: newCar.Year,
            Price: newCar.InitialPrice,
            Owned: false,
            Owner:null,
          },
        };
        this.DocClient.put(params, (err, data) => {
          if(err) {
            console.error('Unable to add car.', JSON.stringify(err, null, 2));
          } else {
            console.log('Added item:', JSON.stringify(data, null, 2));
            log.info('Car of ID '+newCar.ID+" was added.");
          }
        });
  };

  async delete_Car(ID:number): Promise<void> {
        const TableInfo = {
          TableName: 'Car-Lot',
          Key: {
            Type: "Car",
            ID: ID,
          },
        };
        this.DocClient.delete(TableInfo, (err) => {
          if(err) {
            console.error('Car could not be deleted.', JSON.stringify(err, null, 2));
          } else {
            log.info("Car of ID: "+ID+" deleted.");
          }
        });
        
  };

  async List_Cars(): Promise<Car[]> {
        const params = {
          TableName: 'Car-Lot',
          KeyConditionExpression: '#T = :c',
          ExpressionAttributeNames: {
            '#T': 'Type',
          },
          ExpressionAttributeValues: {
            ':c': 'Car',
          },
        };
        const data = await this.DocClient.query(params).promise();
        if(data.Items) {
          return data.Items as Car[];
        }
        
        return [];
  };

  async Make_Offer(Offer:Offer) {
        const params = {
          TableName: 'Car-Lot',
          Item: {
            Type: 'Offer',
            ID: Offer.ID,
            CarID: Offer.CarID,
            CustomerID: Offer.CustomerID,
            OfferAmount: Offer.OfferAmount,
            Status: Offer.Status,
          },
        };
        this.DocClient.put(params, (err) => {
          if(err) {
            console.error('Unable to make offer', JSON.stringify(err, null, 2));
          } else {
            log.info("Customer #"+Offer.CustomerID+"made an offer of $"+Offer.OfferAmount+"for car #"+Offer.CarID+".");
          }
        });
  };

  async Reject_Offer(offerID:number) {
        const params = {
          TableName: 'Car-Lot',
          Key: {
            Type: 'Offer',
            ID: offerID,
          },
          UpdateExpression: 'set #s=:s',
          ExpressionAttributeNames: {
            '#s': 'Status',
          },
          ExpressionAttributeValues: {
            ':s': 'Rejected',
          },
          ReturnValues: 'UPDATED_NEW',
        };
        this.DocClient.update(params, (err) => {
          if(err) {
            console.error('Could not update offer.', JSON.stringify(err, null, 2));
          } else {
            log.info("Offer of ID: "+offerID+" was rejected.");
          }
        });
  };
    
  async Accept_Offer(offerID:number) {
        const params = {
          TableName: 'Car-Lot',
          Key: {
            Type: 'Offer',
            ID: offerID,
          },
          UpdateExpression: 'set #s=:s',
          ExpressionAttributeNames: {
            '#s': 'Status',
          },
          ExpressionAttributeValues: {
            ':s': 'Approved',
          },
          ReturnValues: 'UPDATED_NEW',
        };
        this.DocClient.update(params, (err) => {
          if(err) {
            console.error('Unable to update offer.', JSON.stringify(err, null, 2));
          } else {
            log.info("Offer of ID: "+offerID+"has been accepted");
          }
        });
  };

  async Delete_Offer(offerID:number): Promise<void> {
        const params = {
          TableName: 'Car-Lot',
          Key: {
            Type:'Offer',
            ID: offerID,
          },
        };
        this.DocClient.delete(params, (err) => {
          if(err) {
            console.error('Could not delete offer', JSON.stringify(err, null, 2));
          } else {
            log.info("Offer of ID"+offerID+"deleted");
          }
        });
        
  };

  async register(Customer: Customer) {
        const params = {
          TableName: 'Car-Lot',
          Item: {
            Type: 'Customer',
            ID: Customer.ID,
            Username: Customer.Username,
            Password: Customer.Password,
            Balance: Customer.Balance=0
          },
        };
        this.DocClient.put(params, (err, data) => {
          if(err) {
            console.error('You could not be registered.', JSON.stringify(err, null, 2));
          } else {
            console.log('You are registered, welcome to our car lot.', JSON.stringify(data, null, 2));
            log.info("A new customer, ID: "+Customer.ID+"has decided to shop with us.");
          }
        });
  };

  async Assign_Ownership(carID:number, custID:number) {
        const params1 = {
          TableName: 'Car-Lot',
          Key: {
            Type: 'Car',
            ID: carID,
          },
          UpdateExpression: 'set #O = :O',
          ExpressionAttributeNames: {
            '#O' : 'Owned',
          },
          ExpressionAttributeValues: {
            ':O' : true,
          },
        };
        this.DocClient.update(params1, (err) => {
          if(err) {
            console.error('Unable to change ownership status.', JSON.stringify(err, null, 2));
          } else {
            log.info("Car of ID: "+carID+" is now owned.");
          }
        });
        const params2 = {
          TableName: 'Car-Lot',
          Key: {
            Type: 'Car',
            ID: carID,
          },
          UpdateExpression: 'set #O=:O',
          ExpressionAttributeNames: {
            '#O': 'OwnerID',
          },
          ExpressionAttributeValues: {
            ':O': custID,
          },
          ReturnValues: 'UPDATED_NEW',
        };
        this.DocClient.update(params2, (err) => {
          if(err) {
            console.error('Unable to assign ownership.', JSON.stringify(err, null, 2));
          } else {
            log.info("Car of ID: "+carID+"is now owned by customer of ID"+custID+".");
          }
        });

        
  };

  async Update_Balance(CustomerID:number ,Amount:number){
    const params1 = {
      TableName: 'Car-Lot',
      Key: {
        Type: 'Customer',
        ID: CustomerID,
      },
      UpdateExpression: 'set #B = :B',
      ExpressionAttributeNames: {
        '#B' : 'Balance',
      },
      ExpressionAttributeValues: {
        ':B' : Amount,
      },
    };
    this.DocClient.update(params1, (err) => {
      if(err) {
        console.error('Unable to update balance.', JSON.stringify(err, null, 2));
      } else {
        log.info("Your balance has been updated.");
      }
    });
  }

  async Make_Payment(payment:Payment) {
        const params = {
          TableName: 'Car-Lot',
          Item: {
            Type: 'payment',
            ID: payment.ID,
            CustomerId: payment.CustomerID,
            Amount: payment.Amount,
            CarID: payment.CarID
          },
        };
        this.DocClient.put(params, (err, data) => {
          if(err) {
            console.error('Unable to register payment.', JSON.stringify(err, null, 2));
          } else {
            console.log('Payment made:', JSON.stringify(data, null, 2));
            log.info("A payment of $"+payment.Amount+" was made by customer #"+payment.CustomerID+" on car #"+payment.CarID+".");
          }
        });
  };

  async getAllCustomers(): Promise<Customer[]> {
      const params = {
        TableName: 'Car-Lot',
        KeyConditionExpression: '#T = :C',
        ExpressionAttributeNames: {
          '#T': 'Type',
        },
        ExpressionAttributeValues: {
          ':C': 'Customer',
        },
      };
      const data = await this.DocClient.query(params).promise();
      if(data.Items) {
        return data.Items as Customer[];
      }
      
      return [];
  };

  async getAllEmployees(): Promise<Employee[]> {
    const params = {
      TableName: 'Car-Lot',
      KeyConditionExpression: '#T = :E',
      ExpressionAttributeNames: {
        '#T': 'Type',
      },
      ExpressionAttributeValues: {
        ':E': 'Employee',
      },
    };
    const data = await this.DocClient.query(params).promise();
    if(data.Items) {
      return data.Items as Employee[];
    }
    
    return [];
  };

  async getAllCars(): Promise<Car[]> {
    const params = {
      TableName: 'Car-Lot',
      KeyConditionExpression: '#T = :C',
      ExpressionAttributeNames: {
        '#T': 'Type',
      },
      ExpressionAttributeValues: {
        ':C': 'Car',
      },
    };
    const data = await this.DocClient.query(params).promise();
    if(data.Items) {
      return data.Items as Car[];
    }
    
    return [];
  }

  async getAllPayments(): Promise<Payment[]> {
    const params = {
      TableName: 'Car-Lot',
      KeyConditionExpression: '#T = :P',
      ExpressionAttributeNames: {
        '#T': 'Type',
      },
      ExpressionAttributeValues: {
        ':P': 'Payment',
      },
    };
    const data = await this.DocClient.query(params).promise();
    if(data.Items) {
      return data.Items as Payment[];
    }
    
    return [];
  }

  async getAllOffers(): Promise<Offer[]> {
    const params = {
      TableName: 'Car-Lot',
      KeyConditionExpression: '#T = :O',
      ExpressionAttributeNames: {
        '#T': 'Type',
      },
      ExpressionAttributeValues: {
        ':O': 'Offer',
      },
    };
    const data = await this.DocClient.query(params).promise();
    if(data.Items) {
      return data.Items as Offer[];
    }
    
    return [];
  }

};

export default new DynaDAO();