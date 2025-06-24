import {Address, Id, PositiveNumber} from "../../domain/valueObject";

describe('A positive number', () => {
    it('Allows positive values', () => {
        const aPositiveNumber = PositiveNumber.create(1);
        expect(aPositiveNumber.value).toBe(1);
    });

    it('Does not allow negative values', () => {
        expect(() => PositiveNumber.create(-1)).toThrow('Value must be a positive number');
    });

    it('multiplies two positive numbers', () => {
        const aPositiveNumber = PositiveNumber.create(2);
        const anotherPositiveNumber = PositiveNumber.create(3);

        const result = aPositiveNumber.multiply(anotherPositiveNumber);

        expect(result).toEqual(PositiveNumber.create(6));
    })

    it('adds two given positive numbers', () => {
        const aPositiveNumber = PositiveNumber.create(2);
        const anotherPositiveNumber = PositiveNumber.create(3);

        const result = aPositiveNumber.add(anotherPositiveNumber);

        expect(result).toEqual(PositiveNumber.create(5));
    })
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
})

describe('An Id', () => {
    it('Creates a unique identifier', () => {
        const id1 = Id.create();
        const id2 = Id.create();
        expect(id1.value).not.toBe(id2.value);
    })
})