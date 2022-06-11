class Matchers {
    actual: any
    constructor(actual: any) {
        this.actual = actual;
    }

    toBe(expected: any) {
        if (expected === this.actual) {
            console.log(`Succeeded`)
        } else {
            throw new Error(`Fail - Actual: ${this.actual}, Expected: ${expected}`)
        }
    }

    toEqual(expected: any) {
        if (expected == this.actual) {
            console.log(`Succeeded`)
        } else {
            throw new Error(`Fail - Actual: ${this.actual}, Expected: ${expected}`)
        }
    }

    toBeTruthy() {
        if (this.actual) {
            console.log(`Succeeded`)
        } else {
            console.log(`Fail - Expected value to be truthy but got ${this.actual}`)
            throw new Error(`Fail - Expected value to be truthy but got ${this.actual}`)
        }
    }
}

export function expect(actual: any) {
    return new Matchers(actual);
}

export function describe(suiteName: string, fn: Function) {
    try {
        console.log(`suite: ${suiteName}`);
        fn();
    } catch (err) {
        // @ts-ignore
        console.log(err.message);
    }
}

export function it(testName: string, fn: Function) {
    console.log(`test: ${testName}`);
    try {
        fn();
    } catch (err) {
        console.log(err);
        throw new Error('test run failed');
    }
}

export const test = it