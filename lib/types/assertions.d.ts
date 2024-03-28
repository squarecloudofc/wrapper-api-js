import { ZodSchema } from 'zod';

interface BaseAssertionProps {
    schema: ZodSchema;
    value: unknown;
    code?: string;
}
interface LiteralAssertionProps extends BaseAssertionProps {
    expect: string;
}
interface APIObjectAssertionProps extends BaseAssertionProps {
    code: string;
    route: string;
}

export type { APIObjectAssertionProps, BaseAssertionProps, LiteralAssertionProps };
