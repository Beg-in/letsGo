const tag = message => `[LetsGo] ${message}`;

export function log(message) {
  console.error(tag(message));
};

export class InternalError extends Error {
  constructor(message, ...args) {
    message = tag(message);
    super(message, ...args);
  }
};

export function handle(e) {
  if (e instanceof InternalError) {
    console.error(e.message);
  } else if (e instanceof Error) {
    throw e;
  }
};

export function raise(...args) {
  return new InternalError(...args);
};

