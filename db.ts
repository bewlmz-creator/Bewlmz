
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
    await this.pullFromSupabase();
  }

  static async pullFromSupabase() {
    try {
      // Pull Products
      const { data: products, error: pError } = await supabase.from('products').select('*');
      if (!pError && products && products.length > 0) {
        const mappedProducts = products.map(p => {
          const defaultProduct = FEATURED_PRODUCTS.find(fp => fp.id === p.id);
          return {
            ...p,
            longDescription: p.long_description || p.longDescription || defaultProduct?.longDescription,
            downloadUrl: p.download_url || p.downloadUrl || defaultProduct?.downloadUrl,
            image: p.image || defaultProduct?.image
          };
        });
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(mappedProducts));
      }

      // Pull Orders
      const { data: orders, error: oError } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!oError && orders) {
        const mappedOrders = orders.map(o => ({
          ...o,
          proofImage: o.proof_image || o.proofImage,
          productIds: o.product_ids || o.productIds
        }));
        localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(mappedOrders));
      }

      // Pull Config
      const { data: configs } = await supabase.from('site_config').select('*');
      if (configs) {
        configs.forEach(cfg => {
          if (cfg.key === 'banner' && cfg.value?.url) localStorage.setItem(DB_KEYS.BANNER, cfg.value.url);
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
    return data ? JSON.parse(data) : FEATURED_PRODUCTS;
  }

  static async saveProducts(products: Product[]): Promise<boolean> {
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    this.sync();
    
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
      return true;
    } catch (e) {
      console.error("Product Save Error:", e);
      return false;
    }
  }

  static getOrders(): any[] {
    const data = localStorage.getItem(DB_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  static async addOrder(order: any): Promise<boolean> {
    const normalizedOrder = {
      ...order,
      email: order.email?.toLowerCase().trim(),
      created_at: new Date().toISOString()
    };
    
    const payload = {
      id: normalizedOrder.id,
      name: normalizedOrder.name,
      email: normalizedOrder.email,
      product: normalizedOrder.product,
      product_ids: Array.isArray(normalizedOrder.productIds) ? normalizedOrder.productIds : [normalizedOrder.productIds],
      amount: normalizedOrder.amount,
      date: normalizedOrder.date,
      status: normalizedOrder.status,
      proof_image: normalizedOrder.proofImage,
      created_at: normalizedOrder.created_at
    };

    const { error } = await supabase.from('orders').insert(payload);

    if (error) {
      console.error("Order Insert Error:", error.message);
      return false;
    }

    const orders = this.getOrders();
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([normalizedOrder, ...orders]));
    this.sync();
    return true;
  }

  static async updateOrder(orderId: string, updates: any) {
    const orders = this.getOrders();
    const dbUpdates: any = { ...updates };
    
    if (updates.proofImage) dbUpdates.proof_image = updates.proofImage;
    if (updates.productIds) dbUpdates.product_ids = updates.productIds;

    const updated = orders.map(o => o.id === orderId ? { ...o, ...updates } : o);
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(updated));
    this.sync();

    await supabase.from('orders').update(dbUpdates).eq('id', orderId);
  }

  static async deleteOrder(orderId: string) {
    const orders = this.getOrders().filter(o => o.id !== orderId);
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
    this.sync();
    await supabase.from('orders').delete().eq('id', orderId);
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
      instructions: localStorage.getItem(DB_KEYS.INSTRUCTIONS) || "ये QR CODE को Scan करके पेमेंट करें। \nपेमेंट के बाद 'Proceed Payment' बटन दबाएं।"
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
