
import { Product } from './types';
import { FEATURED_PRODUCTS, HERO_BANNER, DEFAULT_QR_CODE } from './constants';
import { supabase } from './lib/supabase';

const DB_KEYS = {
  PRODUCTS: 'bewlmz_db_products',
  ORDERS: 'bewlmz_db_orders',
  BANNER: 'bewlmz_db_banner',
  QR_CODE: 'bewlmz_db_qr',
  RECIPIENT: 'bewlmz_db_recipient',
  INSTRUCTIONS: 'bewlmz_db_instructions'
};

class VaultDB {
  static async init() {
    try {
      await this.pullFromSupabase();
    } catch (e) {
      console.warn("Initial sync failed, using local cache");
    }
  }

  static async pullFromSupabase() {
    try {
      // 1. Pull Products
      const { data: products } = await supabase.from('products').select('*');
      if (products && products.length > 0) {
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
      }

      // 2. Pull Orders (Exclude proof_image from localStorage to avoid quota limits)
      const { data: orders } = await supabase.from('orders')
        .select('id, name, email, product, product_ids, amount, date, status, created_at')
        .order('created_at', { ascending: false });
      
      if (orders) {
        try {
          localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
        } catch (quotaError) {
          console.warn("Storage quota exceeded, keeping only latest orders locally");
          localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders.slice(0, 10)));
        }
      }

      // 3. Pull Config
      const { data: configs } = await supabase.from('site_config').select('*');
      if (configs) {
        configs.forEach(cfg => {
          if (cfg.key === 'banner' && cfg.value?.url) {
            localStorage.setItem(DB_KEYS.BANNER, cfg.value.url);
          }
          if (cfg.key === 'payment' && cfg.value) {
            localStorage.setItem(DB_KEYS.QR_CODE, cfg.value.qr || DEFAULT_QR_CODE);
            localStorage.setItem(DB_KEYS.RECIPIENT, cfg.value.recipient || 'Ranjit Rishidev');
            localStorage.setItem(DB_KEYS.INSTRUCTIONS, cfg.value.instructions || '');
          }
        });
      }

      this.sync();
    } catch (e) {
      console.error("Supabase Sync Failed:", e);
    }
  }

  private static sync() {
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('vault_sync', { detail: { timestamp: Date.now() } }));
  }

  static getProducts(): Product[] {
    const data = localStorage.getItem(DB_KEYS.PRODUCTS);
    if (!data) return FEATURED_PRODUCTS;
    try {
      return JSON.parse(data);
    } catch {
      return FEATURED_PRODUCTS;
    }
  }

  static async saveProducts(products: Product[]): Promise<boolean> {
    try {
      for (const p of products) {
        await supabase.from('products').upsert({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          long_description: p.longDescription,
          features: p.features,
          image: p.image,
          category: p.category,
          download_url: p.downloadUrl
        });
      }
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
      this.sync();
      return true;
    } catch (e) {
      return false;
    }
  }

  static getOrders(): any[] {
    const data = localStorage.getItem(DB_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  static async addOrder(order: any): Promise<boolean> {
    try {
      const payload = {
        id: order.id,
        name: order.name,
        email: order.email?.toLowerCase().trim(),
        product: order.product,
        product_ids: Array.isArray(order.productIds) ? order.productIds : [order.productIds],
        amount: order.amount,
        date: order.date,
        status: order.status,
        proof_image: order.proofImage,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from('orders').insert(payload);
      if (error) throw error;

      // Update local cache without the heavy image
      const { proof_image, ...lightOrder } = payload;
      const orders = this.getOrders();
      try {
        localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([lightOrder, ...orders.slice(0, 49)]));
      } catch (e) { /* Ignore quota if local save fails */ }
      
      this.sync();
      return true;
    } catch (e) {
      console.error("Order Insert Error:", e);
      return false;
    }
  }

  static async updateOrder(orderId: string, updates: any) {
    const dbUpdates: any = { ...updates };
    if (updates.proofImage) dbUpdates.proof_image = updates.proofImage;
    if (updates.productIds) dbUpdates.product_ids = updates.productIds;

    await supabase.from('orders').update(dbUpdates).eq('id', orderId);
    await this.pullFromSupabase();
  }

  static async deleteOrder(orderId: string) {
    await supabase.from('orders').delete().eq('id', orderId);
    await this.pullFromSupabase();
  }

  static getBanner(): string {
    return localStorage.getItem(DB_KEYS.BANNER) || HERO_BANNER;
  }

  static async setBanner(url: string): Promise<boolean> {
    localStorage.setItem(DB_KEYS.BANNER, url);
    this.sync();
    await supabase.from('site_config').upsert({ key: 'banner', value: { url } });
    return true;
  }

  static getPaymentConfig() {
    return {
      qr: localStorage.getItem(DB_KEYS.QR_CODE) || DEFAULT_QR_CODE,
      recipient: localStorage.getItem(DB_KEYS.RECIPIENT) || 'Ranjit Rishidev',
      instructions: localStorage.getItem(DB_KEYS.INSTRUCTIONS) || "ये QR CODE को Scan करके पेमेंट करें।"
    };
  }

  static async setPaymentConfig(config: { qr: string, recipient: string, instructions: string }): Promise<boolean> {
    localStorage.setItem(DB_KEYS.QR_CODE, config.qr);
    localStorage.setItem(DB_KEYS.RECIPIENT, config.recipient);
    localStorage.setItem(DB_KEYS.INSTRUCTIONS, config.instructions);
    this.sync();
    await supabase.from('site_config').upsert({ key: 'payment', value: config });
    return true;
  }
}

VaultDB.init();
export default VaultDB;
