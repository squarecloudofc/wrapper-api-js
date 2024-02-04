import * as z from "zod";
import { SquareCloudAPIError } from "./structures";

const stringSchema = z.coerce.string();
const booleanSchema = z.coerce.boolean();
const pathLikeSchema = z.string().or(z.instanceof(Buffer));

export function validateString(value: unknown, code?: string): asserts value is string {
  handleValidation({ schema: stringSchema, expect: "string", value, code });
}

export function validateBoolean(value: unknown, code?: string): asserts value is boolean {
  handleValidation({ schema: booleanSchema, expect: "boolean", value, code });
}

export function validatePathLike(value: unknown, code?: string): asserts value is string | Buffer {
  handleValidation({ schema: pathLikeSchema, expect: "string or Buffer", value, code });
}

export function handleValidation({
  schema,
  value,
  expect,
  code,
}: {
  schema: z.Schema;
  value: unknown;
  expect: string;
  code?: string;
}) {
  try {
    schema.parse(value);
  } catch {
    throw new SquareCloudAPIError(
      code ? `INVALID_${code}` : "VALIDATION_ERROR",
      `Expect ${expect}, got ${typeof value}`,
    );
  }
}
