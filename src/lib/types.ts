export type CatalogProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  category: string;
  imageUrl: string | null;
  featured: boolean;
};

export type StoreSettings = {
  storeName: string;
  tagline: string;
  whatsapp: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  primaryColor: string;
};
