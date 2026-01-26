
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  longDescription?: string;
  features?: string[];
  image: string;
  category: 'course' | 'software' | 'asset';
  downloadUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
