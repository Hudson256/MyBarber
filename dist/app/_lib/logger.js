const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const filterStripeMessages = (message) => {
    if (typeof message === "string") {
        return message.toLowerCase().includes("stripe");
    }
    return false;
};
console.log = function (...args) {
    if (!args.some(filterStripeMessages)) {
        originalConsoleLog.apply(console, args);
    }
};
console.error = function (...args) {
    if (!args.some(filterStripeMessages)) {
        originalConsoleError.apply(console, args);
    }
};
export const logger = {
    log: (...args) => {
        if (!args.some(filterStripeMessages)) {
            originalConsoleLog.apply(console, args);
        }
    },
    error: (...args) => {
        if (!args.some(filterStripeMessages)) {
            originalConsoleError.apply(console, args);
        }
    },
};
