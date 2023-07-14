export type Keys<T, N> = keyof T & keyof N;

export interface Repository<N, T, K extends keyof N> {
  create: (data: N) => Promise<T>;
  findOneBy: (key: K, value: N[K]) => Promise<T | null>;
}
