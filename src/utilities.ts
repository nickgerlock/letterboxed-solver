declare const __brand: unique symbol
type Brand<B> = { [__brand]: B }

export type Branded<T, B> = T & Brand<B>

export function isDefined<T>(maybe: T | undefined): maybe is T {
  return !!maybe;
}

export function union<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a, ...b]);
}
