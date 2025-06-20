import {Address, PositiveNumber} from "../../domain/valueObject";

describe('A positive number', () => {
    it('Allows positive values', () => {
        const aPositiveNumber = PositiveNumber.create(1);
        expect(aPositiveNumber.value).toBe(1);
    });

    it('Does not allow negative values', () => {
        expect(() => PositiveNumber.create(-1)).toThrow('Value must be a positive number');
    });
})

describe('An address', () => {
    it('Allows valid addresses', () => {
        const anAddress = Address.create('123 Main St, Springfield, USA');
        expect(anAddress.value).toBe('123 Main St, Springfield, USA');
    });

    it('Does not allow empty addresses', () => {
        expect(() => Address.create('')).toThrowError('Address cannot be empty');
        expect(() => Address.create('   ')).toThrow('Address cannot be empty');
    });

    // it('Does not allow addresses with only spaces', () => {
    //
    // });
})