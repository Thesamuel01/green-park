export type Keys<T, N> = keyof T & keyof N;

export interface Filter {
  field: string;
  operator:
    | 'equal'
    | 'greaterThan'
    | 'lessThan'
    | 'greaterThanOrEqual'
    | 'lessThanOrEqual'
    | 'like';
  value: unknown;
}

export interface Repository<N, T, K extends keyof N> {
  create: (data: N) => Promise<T>;
  findOneBy: <Key extends K>(
    key: Key,
    value: N[Key] extends string | number ? N[Key] : never
  ) => Promise<T | null>;
}
