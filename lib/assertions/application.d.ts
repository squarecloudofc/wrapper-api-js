import { ApplicationLanguage } from '@squarecloud/api-types/v2';
import * as z from 'zod';

declare const applicationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    desc: z.ZodOptional<z.ZodString>;
    cluster: z.ZodString;
    ram: z.ZodNumber;
    language: z.ZodNativeEnum<typeof ApplicationLanguage>;
    isWebsite: z.ZodBoolean;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodString;
    name: z.ZodString;
    desc: z.ZodOptional<z.ZodString>;
    cluster: z.ZodString;
    ram: z.ZodNumber;
    language: z.ZodNativeEnum<typeof ApplicationLanguage>;
    isWebsite: z.ZodBoolean;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodString;
    name: z.ZodString;
    desc: z.ZodOptional<z.ZodString>;
    cluster: z.ZodString;
    ram: z.ZodNumber;
    language: z.ZodNativeEnum<typeof ApplicationLanguage>;
    isWebsite: z.ZodBoolean;
}, z.ZodTypeAny, "passthrough">>;
declare const websiteApplicationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    desc: z.ZodOptional<z.ZodString>;
    cluster: z.ZodString;
    ram: z.ZodNumber;
    language: z.ZodNativeEnum<typeof ApplicationLanguage>;
    isWebsite: z.ZodLiteral<true>;
    domain: z.ZodString;
    custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodString;
    name: z.ZodString;
    desc: z.ZodOptional<z.ZodString>;
    cluster: z.ZodString;
    ram: z.ZodNumber;
    language: z.ZodNativeEnum<typeof ApplicationLanguage>;
    isWebsite: z.ZodLiteral<true>;
    domain: z.ZodString;
    custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodString;
    name: z.ZodString;
    desc: z.ZodOptional<z.ZodString>;
    cluster: z.ZodString;
    ram: z.ZodNumber;
    language: z.ZodNativeEnum<typeof ApplicationLanguage>;
    isWebsite: z.ZodLiteral<true>;
    domain: z.ZodString;
    custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.ZodTypeAny, "passthrough">>;
declare function assertApplication(value: unknown): asserts value is z.infer<typeof applicationSchema>;
declare function assertWebsiteApplication(value: unknown): asserts value is z.infer<typeof websiteApplicationSchema>;

export { assertApplication, assertWebsiteApplication };
