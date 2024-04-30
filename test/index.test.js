import { findAvailableSlot } from '../src/index';
import fs from 'fs';

describe('findAvailableSlot()', () => {
    for (let fileNumber = 1; fileNumber <= 5; fileNumber++) {
        it(`should return output${fileNumber} result`, () => {
            const input = fs.readFileSync(`./data/input${fileNumber}.txt`).toString();
            const output = fs.readFileSync(`./data/output${fileNumber}.txt`).toString();

            const result = findAvailableSlot(input);
    
            expect(result).toEqual(output);
        })
    }
});
