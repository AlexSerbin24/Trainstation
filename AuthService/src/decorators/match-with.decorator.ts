import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

/*
This decorator is used for ensuring that the value of the property matches the value of another property in the same class. 
It's often used for confirming that the password and confirm password fields in a form have identical values. 
*/

export function MatchWith(property: string, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchWithConstraint,
        });
    };
}

@ValidatorConstraint({name: 'MatchWith'})
export class MatchWithConstraint implements ValidatorConstraintInterface {

    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return value === relatedValue;
    }

}