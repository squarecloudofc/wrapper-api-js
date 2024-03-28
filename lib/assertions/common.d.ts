import { LiteralAssertionProps, APIObjectAssertionProps } from '../types/assertions.js';
import 'zod';

declare function handleLiteralAssertion({ schema, value, expect, code, }: LiteralAssertionProps): void;
declare function handleAPIObjectAssertion({ schema, value, code, route, }: APIObjectAssertionProps): void;

export { handleAPIObjectAssertion, handleLiteralAssertion };
