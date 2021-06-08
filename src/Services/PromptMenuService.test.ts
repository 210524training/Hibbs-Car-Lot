import readline from 'readline';
import Customer from '../objects/Customer';
import DynaDAO from '../objects/DynaDAO';
import log from '../objects/log';
import CarService from './CarService';
import * as PrmoptMenuService from './PromptMenuService';

describe('Menus', () => {
    afterAll(() => {
      PrmoptMenuService.rl.close();
    })});

    describe('Function: initialPrompt', () => {
        test('Should resolve with the answer when provided a valid input', async () => {
          const responseOptions = ['0', '1', 'e'];
          const randomIndex = Math.floor(Math.random() * responseOptions.length);
          const validInput = responseOptions[randomIndex];
          PrmoptMenuService.rl.question = jest.fn().mockImplementationOnce(
            (questionText, answer) => answer(validInput),
          );
          await expect(PrmoptMenuService.initialPrompt()).resolves.toBe(validInput);
        });
        test('should reject when provided with an invalid input', async () => {
          const randomlength = Math.floor(Math.random() * 5 + 2);
          // Generate a random string length between 2 and 7 characters
          // Which should be invalid input for initialPrompt
          const invalidInput = Math.random().toString(36).substring(randomlength);
          PrmoptMenuService.rl.question = jest.fn().mockImplementationOnce(
            (questionText, answer) => answer(invalidInput),
          );
          await expect(PrmoptMenuService.initialPrompt()).rejects.toBeUndefined();
        });
      });

      describe('Function: customerPrompt', () => {
        test('Should resolve when provided with valid Input', async () => {
          const responseOptions = ['0', '1', '2','3','4', 'e'];
          const randomIndex = Math.floor(Math.random() * responseOptions.length);
          const validInput = responseOptions[randomIndex];
          PrmoptMenuService.rl.question = jest.fn().mockImplementationOnce(
            (questionText, answer) => answer(validInput),
          );
          await expect(PrmoptMenuService.customerPrompt()).resolves.toBe(validInput);
        });
        test('should resolve to false when provided with an invalid input', async () => {
          const randomlength = Math.floor(Math.random() * 5 + 2);
          const invalidInput = Math.random().toString(36).substring(randomlength);
          PrmoptMenuService.rl.question = jest.fn().mockImplementationOnce(
            (questionText, answer) => answer(invalidInput),
          );
          await expect(PrmoptMenuService.customerPrompt()).resolves.toBe('false');
        });
      });

      describe('Function: employeePrompt', () => {
        test('Should resolve when provided with valid Input', async () => {
          const responseOptions = ['0', '1', '2', '3', '4', '5', '6', 'e'];
          const randomIndex = Math.floor(Math.random() * responseOptions.length);
          const validInput = responseOptions[randomIndex];
          PrmoptMenuService.rl.question = jest.fn().mockImplementationOnce(
            (questionText, answer) => answer(validInput),
          );
          await expect(PrmoptMenuService.employeePrompt()).resolves.toBe(validInput);
        });
        test('should resolve to false when provided with an invalid input', async () => {
          const randomlength = Math.floor(Math.random() * 5 + 2);
          const invalidInput = Math.random().toString(36).substring(randomlength);
          PrmoptMenuService.rl.question = jest.fn().mockImplementationOnce(
            (questionText, answer) => answer(invalidInput),
          );
          await expect(PrmoptMenuService.employeePrompt()).resolves.toBe('false');
        });
      });

      describe('Function: offerChooseCar', () => {
        test('Should resolve when provided with valid Input', async () => {
          CarService.carInventory = await DynaDAO.getAllCars();
          const cars = CarService.carInventory;
          let validInput = '';
          let x = -1;
          for(let i = 0; i < cars.length; i++) {
            if(cars[i].OwnerID ===null) {
              x = i;
              break;
            }
          }
          if(x === -1) {
            validInput = 'false';
          } else {
            validInput = cars[x].ID.toString();
          }
          PrmoptMenuService.rl.question = jest.fn().mockImplementationOnce(
            (questionText, answer) => answer(validInput),
          );
          await expect(PrmoptMenuService.Customer_Select_Car_For_Offer()).resolves.toBe(validInput);
        });
        test('should resolve to false when provided with an invalid input', async () => {
          CarService.carInventory = await DynaDAO.getAllCars();
          const cars = CarService.carInventory;
          let x = 0;
          for(let i = 0; i < cars.length; i++) {
            if(cars[i].OwnerID !== null) {
              x = i;
              break;
            }
          }
          const invalidInput = cars[x];
          PrmoptMenuService.rl.question = jest.fn().mockImplementationOnce(
            (questionText, answer) => answer(invalidInput),
          );
          await expect(PrmoptMenuService.Customer_Select_Car_For_Offer()).resolves.toBe('false');
        });
      });
    
      describe('Function: offerChooseOffer', () => {
        test('Should resolve when provided with valid Input', async () => {
          const validInput = Math.floor(Math.random() * 100);
          PrmoptMenuService.rl.question = jest.fn().mockImplementationOnce(
            (questionText, answer) => answer(validInput),
          );
          await expect(PrmoptMenuService.Customer_Select_Car_For_Offer()).resolves.toBe(validInput);
        });
        test('should resolve to false when provided with an invalid input', async () => {
          const randomlength = Math.floor(Math.random() * 5 + 2);
          const invalidInput = Math.random().toString(36).substring(randomlength);
          PrmoptMenuService.rl.question = jest.fn().mockImplementationOnce(
            (questionText, answer) => answer(invalidInput),
          );
          await expect(PrmoptMenuService.Customer_Select_Car_For_Offer()).resolves.toBe('false');
        });
      });