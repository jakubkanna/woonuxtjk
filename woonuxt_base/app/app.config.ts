/**
 * App configuration.
 * This file is used to configure the app settings.
 * Below are the default values.
 */
export default defineAppConfig({
  siteName: 'JAKUB KANNA',
  shortDescription: 'Official store of Jakub Kanna.',
  description: `Official artist store. Discover exclusive creations, prints, and merchandise. Each piece is personally signed or stamped and comes with the necessary certificates of authenticity. We are shipping worldwide. Every purchase directly supports the authors.`,
  promoNotice: { message: 'Free shipping on orders over 100€' },
  baseUrl: 'http://localhost:3000/',
  siteImage: 'https://user-images.githubusercontent.com/5116925/218879668-f4c1f9fd-bef4-44b0-bc7f-e87d994aa3a1.png',
  storeSettings: {
    autoOpenCart: false,
    storeSettings: { showReviews: false },
    showFilters: true,
    showOrderByDropdown: true,
    showSKU: true,
    showRelatedProducts: true,
    showProductCategoriesOnSingleProduct: true,
    showBreadcrumbOnSingleProduct: true,
    showMoveToWishlist: true,
    hideBillingAddressForVirtualProducts: false,
    initStoreOnUserActionToReduceServerLoad: true,
    saleBadge: 'percent', // 'percent', 'onSale' or 'hidden'
    socialLoginsDisplay: 'buttons', // 'buttons' or 'icons'
  },
});
