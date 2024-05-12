import { ValidationArguments } from "class-validator";
import { MatchWithConstraint } from "../match-with.decorator";


describe('UserService', () => {
    let validationArgumentsMock: ValidationArguments;
    let matchWithConstraint: MatchWithConstraint;
  
    beforeEach(() => {
      validationArgumentsMock = {
        value: 'testValue',
        constraints: ['relatedProperty'],
        object: {
          relatedProperty: 'testValue',
        },
        property: 'testProperty',
        targetName: 'TestClass',
      } as ValidationArguments;
  
      matchWithConstraint = new MatchWithConstraint();
    });
  
    it('should return true if values match', () => {
      const result = matchWithConstraint.validate('testValue', validationArgumentsMock);
      expect(result).toBeTruthy();
    });
  
    it('should return false if values do not match', () => {
      const result = matchWithConstraint.validate('anotherValue', validationArgumentsMock);
      expect(result).toBeFalsy();
    });
  
})