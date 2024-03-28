// src/structures/collection.ts
var Collection = class extends Map {
  first(amount) {
    if (typeof amount === "undefined") {
      return this.values().next().value;
    }
    if (amount < 0) {
      return this.last(amount * -1);
    }
    amount = Math.min(this.size, amount);
    return Array.from({ length: amount }, () => this.values().next().value);
  }
  last(amount) {
    const arr = [...this.values()];
    if (typeof amount === "undefined")
      return arr[arr.length - 1];
    if (amount < 0)
      return this.first(amount * -1);
    if (!amount)
      return [];
    return arr.slice(-amount);
  }
  /**
   * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse Array.reverse()}
   * but returns a Collection instead of an Array.
   */
  reverse() {
    const entries = [...this.entries()].reverse();
    this.clear();
    for (const [key, value] of entries) {
      this.set(key, value);
    }
    return this;
  }
  find(fn, thisArg) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    if (typeof thisArg !== "undefined") {
      fn = fn.bind(thisArg);
    }
    for (const [key, val] of this) {
      if (fn(val, key, this))
        return val;
    }
  }
  filter(fn, thisArg) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    if (typeof thisArg !== "undefined") {
      fn = fn.bind(thisArg);
    }
    const results = new this.constructor[Symbol.species]();
    for (const [key, val] of this) {
      if (fn(val, key, this))
        results.set(key, val);
    }
    return results;
  }
  map(fn, thisArg) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    if (typeof thisArg !== "undefined") {
      fn = fn.bind(thisArg);
    }
    return Array.from({ length: this.size }, () => {
      const [key, value] = this.entries().next().value;
      return fn(value, key, this);
    });
  }
  some(fn, thisArg) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    if (typeof thisArg !== "undefined") {
      fn = fn.bind(thisArg);
    }
    for (const [key, val] of this) {
      if (fn(val, key, this))
        return true;
    }
    return false;
  }
  every(fn, thisArg) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    if (typeof thisArg !== "undefined") {
      fn = fn.bind(thisArg);
    }
    for (const [key, val] of this) {
      if (!fn(val, key, this))
        return false;
    }
    return true;
  }
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
  reduce(fn, initialValue) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    let accumulator;
    if (typeof initialValue !== "undefined") {
      accumulator = initialValue;
      for (const [key, val] of this) {
        accumulator = fn(accumulator, val, key, this);
      }
      return accumulator;
    }
    let first = true;
    for (const [key, val] of this) {
      if (first) {
        accumulator = val;
        first = false;
        continue;
      }
      accumulator = fn(accumulator, val, key, this);
    }
    if (first) {
      throw new TypeError("Reduce of empty collection with no initial value");
    }
    return accumulator;
  }
  each(fn, thisArg) {
    if (typeof fn !== "function") {
      throw new TypeError(`${fn} is not a function`);
    }
    this.forEach(fn, thisArg);
    return this;
  }
  /**
   * Creates an identical shallow copy of this collection.
   *
   * @example
   * ```ts
   * const newColl = someColl.clone();
   * ```
   */
  clone() {
    return new this.constructor[Symbol.species](this);
  }
  toJSON() {
    return [...this.values()];
  }
};
export {
  Collection
};
//# sourceMappingURL=collection.mjs.map