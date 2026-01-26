
import { Product } from './types';

export const HERO_BANNER = "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200&h=500";

export const TEXT_SLIDES = [
  "STEP 1: Choose your Plan (Plan A or Plan B) and get instant video access.",
  "STEP 2: Watch the step-by-step setup guides and launch your business from home.",
  "STEP 3: Start earning and scale your income up to 3 Lakh/Month with our proven ideas."
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'plan-a',
    name: 'Plan A',
    price: 999.00,
    description: 'इस एक Idea से आपकी पूरी जिंदगी बदल जाएगी..!!',
    longDescription: 'Plan A is a specialized starter course focusing on a high-growth single business model. Perfect for beginners, this course takes you through 7 detailed episodes that explain everything from initial setup to generating your first 1 Lakh per month.',
    features: [
      'Total Episode : 7',
      "No of Idea's : 1",
      'Stock : Only For 100 People'
    ],
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800&h=1200',
    category: 'course',
    downloadUrl: '#'
  },
  {
    id: 'plan-b',
    name: 'Plan B',
    price: 299.00,
    description: 'इस एक Idea से आपकी पूरी जिंदगी बदल जाएगी..!!',
    longDescription: 'Plan B is our most powerful success bundle. It contains 3 recent, high-potential business ideas currently dominating the digital space. With over 12 episodes and a commitment of just 2 hours per day, this is designed for those aiming for 3 Lakh/Month.',
    features: [
      'Total Episode : 12 +',
      "No of Idea's : 3 (Recent)",
      'Time : Min. 2 Hour / Day'
    ],
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800&h=1200',
    category: 'course',
    downloadUrl: '#'
  }
];

export const NEW_ARRIVALS: Product[] = [];
