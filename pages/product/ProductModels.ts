export enum SortingOptions {
  AZ = 'az',
  ZA = 'za',
  LOHI = 'lohi',
  HILO = 'hilo',
}

export type SortingOptionsType =
  | SortingOptions.AZ
  | SortingOptions.ZA
  | SortingOptions.LOHI
  | SortingOptions.HILO;

export type ProductItem = {
  title: string;
  price: number;
};

export const SortingFunctions: Record<
  SortingOptions,
  (a: ProductItem, b: ProductItem) => number
> = {
  [SortingOptions.AZ]: (a, b) => a.title.localeCompare(b.title),
  [SortingOptions.ZA]: (a, b) => b.title.localeCompare(a.title),
  [SortingOptions.LOHI]: function (a: ProductItem, b: ProductItem): number {
    if (a.price == b.price)
      // ascending by title
      return a.title.localeCompare(b.title);
    else
      // ascending by price
      return a.price - b.price;
  },
  [SortingOptions.HILO]: function (a: ProductItem, b: ProductItem): number {
    if (a.price == b.price)
      // ascending by title
      return a.title.localeCompare(b.title);
    else
      // descending by price
      return b.price - a.price;
  },
};
