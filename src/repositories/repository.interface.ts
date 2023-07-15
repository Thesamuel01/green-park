export type Keys<T, N> = keyof T & keyof N;

export interface Repository<N, T, K extends keyof N> {
  create: (data: N) => Promise<T>;
  findOneBy: <Key extends K>(
    key: Key,
    value: N[Key] extends string | number ? N[Key] : never
  ) => Promise<T | null>;
  findByParams: (params: Partial<N>) => Promise<T[]>;
}
