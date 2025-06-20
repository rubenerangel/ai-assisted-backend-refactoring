import {PositiveNumber} from "../../domain/valueObject";

describe('A positive number', () => {
    it('Allows positive values', () => {
        const aPositiveNumber = PositiveNumber.create(1);
        expect(aPositiveNumber.value).toBe(1);
    });

    it('Does not allow negative values', () => {
        expect(() => PositiveNumber.create(-1)).toThrow('Value must be a positive number');
    });
})