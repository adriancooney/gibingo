import Debug from "debug";

const DEBUG_PREFIX = "dud";

export function createLogger(name: string) {
  return Debug(`${DEBUG_PREFIX}:${name}`);
}