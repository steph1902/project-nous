/**
 * Test setup file
 * Runs before each test file
 */

// Increase timeout for integration tests
jest.setTimeout(30000);

// Mock console.error to not pollute test output
const originalError = console.error;
beforeAll(() => {
    console.error = (...args: unknown[]) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning:')
        ) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});
