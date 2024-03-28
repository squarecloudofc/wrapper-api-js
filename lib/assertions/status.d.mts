import { ApplicationStatus } from '@squarecloud/api-types/v2';
import * as z from 'zod';

declare const simpleStatusSchema: z.ZodUnion<[z.ZodObject<{
    id: z.ZodString;
    cpu: z.ZodString;
    ram: z.ZodString;
    running: z.ZodLiteral<true>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodString;
    cpu: z.ZodString;
    ram: z.ZodString;
    running: z.ZodLiteral<true>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodString;
    cpu: z.ZodString;
    ram: z.ZodString;
    running: z.ZodLiteral<true>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    id: z.ZodString;
    running: z.ZodLiteral<false>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodString;
    running: z.ZodLiteral<false>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodString;
    running: z.ZodLiteral<false>;
}, z.ZodTypeAny, "passthrough">>]>;
declare const statusSchema: z.ZodObject<{
    cpu: z.ZodString;
    ram: z.ZodString;
    status: z.ZodNativeEnum<typeof ApplicationStatus>;
    running: z.ZodBoolean;
    storage: z.ZodString;
    network: z.ZodObject<{
        total: z.ZodString;
        now: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        total: string;
        now: string;
    }, {
        total: string;
        now: string;
    }>;
    requests: z.ZodNumber;
    uptime: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    cpu: z.ZodString;
    ram: z.ZodString;
    status: z.ZodNativeEnum<typeof ApplicationStatus>;
    running: z.ZodBoolean;
    storage: z.ZodString;
    network: z.ZodObject<{
        total: z.ZodString;
        now: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        total: string;
        now: string;
    }, {
        total: string;
        now: string;
    }>;
    requests: z.ZodNumber;
    uptime: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    cpu: z.ZodString;
    ram: z.ZodString;
    status: z.ZodNativeEnum<typeof ApplicationStatus>;
    running: z.ZodBoolean;
    storage: z.ZodString;
    network: z.ZodObject<{
        total: z.ZodString;
        now: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        total: string;
        now: string;
    }, {
        total: string;
        now: string;
    }>;
    requests: z.ZodNumber;
    uptime: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.ZodTypeAny, "passthrough">>;
declare function assertSimpleStatus(value: unknown): asserts value is z.infer<typeof simpleStatusSchema>;
declare function assertStatus(value: unknown): asserts value is z.infer<typeof statusSchema>;

export { assertSimpleStatus, assertStatus };
