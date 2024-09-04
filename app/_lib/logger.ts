const originalConsoleLog = console.log
const originalConsoleError = console.error

const filterStripeMessages = (message: any): boolean => {
  if (typeof message === "string") {
    return message.toLowerCase().includes("stripe")
  }
  return false
}

console.log = function (...args: any[]) {
  if (!args.some(filterStripeMessages)) {
    originalConsoleLog.apply(console, args)
  }
}

console.error = function (...args: any[]) {
  if (!args.some(filterStripeMessages)) {
    originalConsoleError.apply(console, args)
  }
}

export const logger = {
  log: (...args: any[]) => {
    if (!args.some(filterStripeMessages)) {
      originalConsoleLog.apply(console, args)
    }
  },
  error: (...args: any[]) => {
    if (!args.some(filterStripeMessages)) {
      originalConsoleError.apply(console, args)
    }
  },
}
