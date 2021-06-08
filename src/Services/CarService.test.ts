/* eslint-disable no-plusplus */
import CarService from './CarService';
import DynaDAO from '../objects/DynaDAO';

describe('***CarService Module***', () => {
  describe('Function: carExists', () => {
    test('Should resolve when provided with valid Input', async () => {
      CarService.carInventory = await DynaDAO.getAllCars();
      const cars = CarService.carInventory;
      let x = -1;
      let validInput = '0';
      for(let i = 0; i < cars.length; i++) {
        if(cars[i].OwnerID === null) {
          x = i;
          break;
        }
      }
      if(x === -1) {
        expect(CarService.Car_Available_For_Sale(parseInt(validInput, 10))).toBe(false);
      } else {
        validInput = cars[x].ID.toString();
        expect(CarService.Car_Available_For_Sale(parseInt(validInput, 10))).toBe(true);
      }
    });
    test('should resolve to false when provided with an invalid input', () => {
      const cars = CarService.carInventory;
      let x = 0;
      for(let i = 0; i < cars.length; i++) {
        if(cars[i].OwnerID === null) {
          x = i;
          break;
        }
      }
      const invalidInput = cars[x].ID;
      expect(CarService.Car_Available_For_Sale(invalidInput)).toBe(false);
    });
  });
});
