/**
 * @internal
 */
interface CollectionConstructor {
    new (): Collection<unknown, unknown>;
    new <K, V>(entries?: readonly (readonly [K, V])[] | null): Collection<K, V>;
    new <K, V>(iterable: Iterable<readonly [K, V]>): Collection<K, V>;
    readonly prototype: Collection<unknown, unknown>;
    readonly [Symbol.species]: CollectionConstructor;
}
/**
 * Separate interface for the constructor so that emitted js does not have a constructor that overwrites itself
 *
 * @internal
 */
interface Collection<K, V> extends Map<K, V> {
    constructor: CollectionConstructor;
}
/**
 * A Map with additional utility methods. This is used throughout \@squarecloud/api rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 *
 * @typeParam K - The key type this collection holds
 * @typeParam V - The value type this collection holds
 */
declare class Collection<K, V> extends Map<K, V> {
    /**
     * Obtains the first value(s) in this collection.
     *
     * @param amount - Amount of values to obtain from the beginning
     * @returns A single value if no amount is provided or an array of values, starting from the end if amount is negative
     */
    first(): V | undefined;
    first(amount: number): V[];
    /**
     * Obtains the last value(s) in this collection.
     *
     * @param amount - Amount of values to obtain from the end
     * @returns A single value if no amount is provided or an array of values, starting from the start if
     * amount is negative
     */
    last(): V | undefined;
    last(amount: number): V[];
    /**
     * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse Array.reverse()}
     * but returns a Collection instead of an Array.
     */
    reverse(): this;
    /**
     * Searches for a single item where the given function returns a truthy value. This behaves like
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find Array.find()}.
     *
     * @param fn - The function to test with (should return boolean)
     * @param thisArg - Value to use as `this` when executing function
     * @example
     * ```ts
     * collection.find(user => user.username === 'Bob');
     * ```
     */
    find<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): V2 | undefined;
    find(fn: (value: V, key: K, collection: this) => unknown): V | undefined;
    find<This, V2 extends V>(fn: (this: This, value: V, key: K, collection: this) => value is V2, thisArg: This): V2 | undefined;
    find<This>(fn: (this: This, value: V, key: K, collection: this) => unknown, thisArg: This): V | undefined;
    /**
     * Identical to
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter()},
     * but returns a Collection instead of an Array.
     *
     * @param fn - The function to test with (should return boolean)
     * @param thisArg - Value to use as `this` when executing function
     * @example
     * ```ts
     * collection.filter(user => user.username === 'Bob');
     * ```
     */
    filter<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): Collection<K2, V>;
    filter<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): Collection<K, V2>;
    filter(fn: (value: V, key: K, collection: this) => unknown): Collection<K, V>;
    filter<This, K2 extends K>(fn: (this: This, value: V, key: K, collection: this) => key is K2, thisArg: This): Collection<K2, V>;
    filter<This, V2 extends V>(fn: (this: This, value: V, key: K, collection: this) => value is V2, thisArg: This): Collection<K, V2>;
    filter<This>(fn: (this: This, value: V, key: K, collection: this) => unknown, thisArg: This): Collection<K, V>;
    /**
     * Maps each item to another value into an array. Identical in behavior to
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array.map()}.
     *
     * @param fn - Function that produces an element of the new array, taking three arguments
     * @param thisArg - Value to use as `this` when executing function
     * @example
     * ```ts
     * collection.map(user => user.tag);
     * ```
     */
    map<T>(fn: (value: V, key: K, collection: this) => T): T[];
    map<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): T[];
    /**
     * Checks if there exists an item that passes a test. Identical in behavior to
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array.some()}.
     *
     * @param fn - Function used to test (should return a boolean)
     * @param thisArg - Value to use as `this` when executing function
     * @example
     * ```ts
     * collection.some(user => user.discriminator === '0000');
     * ```
     */
    some(fn: (value: V, key: K, collection: this) => unknown): boolean;
    some<T>(fn: (this: T, value: V, key: K, collection: this) => unknown, thisArg: T): boolean;
    /**
     * Checks if all items passes a test. Identical in behavior to
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every Array.every()}.
     *
     * @param fn - Function used to test (should return a boolean)
     * @param thisArg - Value to use as `this` when executing function
     * @example
     * ```ts
     * collection.every(user => !user.bot);
     * ```
     */
    every<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): this is Collection<K2, V>;
    every<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): this is Collection<K, V2>;
    every(fn: (value: V, key: K, collection: this) => unknown): boolean;
    every<This, K2 extends K>(fn: (this: This, value: V, key: K, collection: this) => key is K2, thisArg: This): this is Collection<K2, V>;
    every<This, V2 extends V>(fn: (this: This, value: V, key: K, collection: this) => value is V2, thisArg: This): this is Collection<K, V2>;
    every<This>(fn: (this: This, value: V, key: K, collection: this) => unknown, thisArg: This): boolean;
    /**
     * Applies a function to produce a single value. Identical in behavior to
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce Array.reduce()}.
     *
     * @param fn - Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
     * and `collection`
     * @param initialValue - Starting value for the accumulator
     * @example
     * ```ts
     * collection.reduce((acc, guild) => acc + guild.memberCount, 0);
     * ```
     */
    reduce<T>(fn: (accumulator: T, value: V, key: K, collection: this) => T, initialValue?: T): T;
    /**
     * Identical to
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach Map.forEach()},
     * but returns the collection instead of undefined.
     *
     * @param fn - Function to execute for each element
     * @param thisArg - Value to use as `this` when executing function
     * @example
     * ```ts
     * collection
     *  .each(user => console.log(user.username))
     *  .filter(user => user.bot)
     *  .each(user => console.log(user.username));
     * ```
     */
    each(fn: (value: V, key: K, collection: this) => void): this;
    each<T>(fn: (this: T, value: V, key: K, collection: this) => void, thisArg: T): this;
    /**
     * Creates an identical shallow copy of this collection.
     *
     * @example
     * ```ts
     * const newColl = someColl.clone();
     * ```
     */
    clone(): Collection<K, V>;
    toJSON(): V[];
}

export { Collection, type CollectionConstructor };
