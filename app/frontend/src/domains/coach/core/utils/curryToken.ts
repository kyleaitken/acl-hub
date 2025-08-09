export function curryToken<
  T extends (token: string, ...args: any[]) => any,
>(
  fn: T,
  token: string
): (...args: TailParameters<T>) => ReturnType<T> {
  return (...args: any[]) => fn(token, ...args) as ReturnType<T>;
}

// Helper to extract all parameters after the first (the token)
type TailParameters<T> = T extends (arg0: any, ...rest: infer R) => any ? R : never;