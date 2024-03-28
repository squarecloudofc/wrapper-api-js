declare function assertString(value: unknown, code?: string): asserts value is string;
declare function assertBoolean(value: unknown, code?: string): asserts value is boolean;
declare function assertPathLike(value: unknown, code?: string): asserts value is string | Buffer;

export { assertBoolean, assertPathLike, assertString };
