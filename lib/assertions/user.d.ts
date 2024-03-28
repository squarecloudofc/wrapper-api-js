import { UserPlanName, ApplicationLanguage } from '@squarecloud/api-types/v2';
import * as z from 'zod';

declare const userInfoSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        tag: z.ZodString;
        email: z.ZodString;
        plan: z.ZodObject<{
            name: z.ZodNativeEnum<typeof UserPlanName>;
            memory: z.ZodObject<{
                limit: z.ZodNumber;
                available: z.ZodNumber;
                used: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                limit: number;
                available: number;
                used: number;
            }, {
                limit: number;
                available: number;
                used: number;
            }>;
            duration: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            name: UserPlanName;
            memory: {
                limit: number;
                available: number;
                used: number;
            };
            duration?: number | null | undefined;
        }, {
            name: UserPlanName;
            memory: {
                limit: number;
                available: number;
                used: number;
            };
            duration?: number | null | undefined;
        }>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodString;
        tag: z.ZodString;
        email: z.ZodString;
        plan: z.ZodObject<{
            name: z.ZodNativeEnum<typeof UserPlanName>;
            memory: z.ZodObject<{
                limit: z.ZodNumber;
                available: z.ZodNumber;
                used: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                limit: number;
                available: number;
                used: number;
            }, {
                limit: number;
                available: number;
                used: number;
            }>;
            duration: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            name: UserPlanName;
            memory: {
                limit: number;
                available: number;
                used: number;
            };
            duration?: number | null | undefined;
        }, {
            name: UserPlanName;
            memory: {
                limit: number;
                available: number;
                used: number;
            };
            duration?: number | null | undefined;
        }>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodString;
        tag: z.ZodString;
        email: z.ZodString;
        plan: z.ZodObject<{
            name: z.ZodNativeEnum<typeof UserPlanName>;
            memory: z.ZodObject<{
                limit: z.ZodNumber;
                available: z.ZodNumber;
                used: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                limit: number;
                available: number;
                used: number;
            }, {
                limit: number;
                available: number;
                used: number;
            }>;
            duration: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            name: UserPlanName;
            memory: {
                limit: number;
                available: number;
                used: number;
            };
            duration?: number | null | undefined;
        }, {
            name: UserPlanName;
            memory: {
                limit: number;
                available: number;
                used: number;
            };
            duration?: number | null | undefined;
        }>;
    }, z.ZodTypeAny, "passthrough">>;
    applications: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        tag: z.ZodString;
        desc: z.ZodOptional<z.ZodString>;
        ram: z.ZodNumber;
        lang: z.ZodNativeEnum<typeof ApplicationLanguage>;
        cluster: z.ZodString;
        isWebsite: z.ZodBoolean;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodString;
        tag: z.ZodString;
        desc: z.ZodOptional<z.ZodString>;
        ram: z.ZodNumber;
        lang: z.ZodNativeEnum<typeof ApplicationLanguage>;
        cluster: z.ZodString;
        isWebsite: z.ZodBoolean;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodString;
        tag: z.ZodString;
        desc: z.ZodOptional<z.ZodString>;
        ram: z.ZodNumber;
        lang: z.ZodNativeEnum<typeof ApplicationLanguage>;
        cluster: z.ZodString;
        isWebsite: z.ZodBoolean;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "strip", z.ZodTypeAny, {
    user: {
        id: string;
        tag: string;
        email: string;
        plan: {
            name: UserPlanName;
            memory: {
                limit: number;
                available: number;
                used: number;
            };
            duration?: number | null | undefined;
        };
    } & {
        [k: string]: unknown;
    };
    applications: z.objectOutputType<{
        id: z.ZodString;
        tag: z.ZodString;
        desc: z.ZodOptional<z.ZodString>;
        ram: z.ZodNumber;
        lang: z.ZodNativeEnum<typeof ApplicationLanguage>;
        cluster: z.ZodString;
        isWebsite: z.ZodBoolean;
    }, z.ZodTypeAny, "passthrough">[];
}, {
    user: {
        id: string;
        tag: string;
        email: string;
        plan: {
            name: UserPlanName;
            memory: {
                limit: number;
                available: number;
                used: number;
            };
            duration?: number | null | undefined;
        };
    } & {
        [k: string]: unknown;
    };
    applications: z.objectInputType<{
        id: z.ZodString;
        tag: z.ZodString;
        desc: z.ZodOptional<z.ZodString>;
        ram: z.ZodNumber;
        lang: z.ZodNativeEnum<typeof ApplicationLanguage>;
        cluster: z.ZodString;
        isWebsite: z.ZodBoolean;
    }, z.ZodTypeAny, "passthrough">[];
}>;
declare function assertUserInfo(value: unknown): asserts value is z.infer<typeof userInfoSchema>;

export { assertUserInfo };
