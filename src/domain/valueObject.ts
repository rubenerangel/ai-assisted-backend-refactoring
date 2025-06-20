export class PositiveNumber {
    private constructor(readonly value: number) {}

    static create(value: number): PositiveNumber {
        if (value < 0) {
            throw new Error('Value must be a positive number');
        }
        return new PositiveNumber(value);
    }
}