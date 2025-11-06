export enum PageIdentifier {
  Cart,
  Products,
  CheckoutInfo,
  CheckoutOverview,
  CheckoutComplete,
}

const urlsV0: Record<PageIdentifier, string> = {
  [PageIdentifier.Cart]: '/cart.html',
  [PageIdentifier.Products]: '/inventory.html',
  [PageIdentifier.CheckoutInfo]: '/checkout-step-one.html',
  [PageIdentifier.CheckoutOverview]: '/checkout-step-two.html',
  [PageIdentifier.CheckoutComplete]: '/checkout-complete.html',
};

const urlsV1: Record<PageIdentifier, string> = {
  [PageIdentifier.Cart]: '/v1/cart',
  [PageIdentifier.Products]: '/v1/inventory',
  [PageIdentifier.CheckoutInfo]: '/v1/checkout-step-one',
  [PageIdentifier.CheckoutOverview]: '/v1/checkout-step-one',
  [PageIdentifier.CheckoutComplete]: '/v1/checkout-complete',
};

export const Urls = process.env?.SAUCEDEMO_BASE_URL.includes('v1')
  ? urlsV1
  : urlsV0;

export const Titles: Record<PageIdentifier, string> = {
  [PageIdentifier.Cart]: 'Your Cart',
  [PageIdentifier.Products]: 'Products',
  [PageIdentifier.CheckoutInfo]: 'Checkout: Your Information',
  [PageIdentifier.CheckoutOverview]: 'Checkout: Overview',
  [PageIdentifier.CheckoutComplete]: 'Checkout: Complete',
};
