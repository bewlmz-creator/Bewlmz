
import { Product } from './types';
import { FEATURED_PRODUCTS, HERO_BANNER, DEFAULT_QR_CODE } from './constants';

const DB_KEYS = {
  PRODUCTS: 'bewlmz_db_products',
  ORDERS: 'bewlmz_db_orders',
  BANNER: 'bewlmz_db_banner',
  QR_CODE: 'bewlmz_db_qr',
  RECIPIENT: 'bewlmz_db_recipient',
  INSTRUCTIONS: 'bewlmz_db_instructions'
};

class VaultDB {
  private static safeSave(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      this.sync();
      return true;
    } catch (e) {
      console.error("Database Save Error:", e);
      alert("Error: Storage is full! Please use a smaller image or delete some old orders.");
      return false;
    }
  }

  // Products
  static getProducts(): Product[] {
    const data = localStorage.getItem(DB_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : FEATURED_PRODUCTS;
  }

  static saveProducts(products: Product[]): boolean {
    return this.safeSave(DB_KEYS.PRODUCTS, JSON.stringify(products));
  }

  // Orders
  static getOrders(): any[] {
    const data = localStorage.getItem(DB_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  static addOrder(order: any) {
    const orders = this.getOrders();
    // Normalize email before saving
    const normalizedOrder = {
      ...order,
      email: order.email?.toLowerCase().trim()
    };
    const updated = [normalizedOrder, ...orders];
    this.safeSave(DB_KEYS.ORDERS, JSON.stringify(updated));
  }

  static updateOrder(orderId: string, updates: any) {
    const orders = this.getOrders();
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const u = { ...o, ...updates };
        if (u.email) u.email = u.email.toLowerCase().trim();
        return u;
      }
      return o;
    });
    this.safeSave(DB_KEYS.ORDERS, JSON.stringify(updated));
  }

  static deleteOrder(orderId: string) {
    const orders = this.getOrders().filter(o => o.id !== orderId);
    this.safeSave(DB_KEYS.ORDERS, JSON.stringify(orders));
  }

  // Site Config
  static getBanner(): string {
    return localStorage.getItem(DB_KEYS.BANNER) || HERO_BANNER;
  }

  static setBanner(url: string): boolean {
    return this.safeSave(DB_KEYS.BANNER, url);
  }

  static getPaymentConfig() {
    return {
      qr: localStorage.getItem(DB_KEYS.QR_CODE) || DEFAULT_QR_CODE,
      recipient: localStorage.getItem(DB_KEYS.RECIPIENT) || 'Ranjit Rishidev',
      instructions: localStorage.getItem(DB_KEYS.INSTRUCTIONS) || "ये QR CODE को Scan करके पेमेंट करें। \nपेमेंट के बाद 'Proceed Payment' बटन दबाएं।"
    };
  }

  static setPaymentConfig(config: { qr: string, recipient: string, instructions: string }): boolean {
    localStorage.setItem(DB_KEYS.QR_CODE, config.qr);
    localStorage.setItem(DB_KEYS.RECIPIENT, config.recipient);
    localStorage.setItem(DB_KEYS.INSTRUCTIONS, config.instructions);
    this.sync();
    return true;
  }

  private static sync() {
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('vault_sync', { detail: { timestamp: Date.now() } }));
  }
}

export default VaultDB;
