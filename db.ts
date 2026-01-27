
import { Product } from './types';
import { FEATURED_PRODUCTS, HERO_BANNER } from './constants';

const DB_KEYS = {
  PRODUCTS: 'bewlmz_db_products',
  ORDERS: 'bewlmz_db_orders',
  BANNER: 'bewlmz_db_banner',
  QR_CODE: 'bewlmz_db_qr',
  RECIPIENT: 'bewlmz_db_recipient',
  INSTRUCTIONS: 'bewlmz_db_instructions'
};

class VaultDB {
  // Products
  static getProducts(): Product[] {
    const data = localStorage.getItem(DB_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : FEATURED_PRODUCTS;
  }

  static saveProducts(products: Product[]) {
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    this.sync();
  }

  // Orders
  static getOrders(): any[] {
    const data = localStorage.getItem(DB_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  static addOrder(order: any) {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(updated));
    this.sync();
  }

  static updateOrder(orderId: string, updates: any) {
    const orders = this.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, ...updates } : o);
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(updated));
    this.sync();
  }

  static deleteOrder(orderId: string) {
    const orders = this.getOrders().filter(o => o.id !== orderId);
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
    this.sync();
  }

  // Site Config
  static getBanner(): string {
    return localStorage.getItem(DB_KEYS.BANNER) || HERO_BANNER;
  }

  static setBanner(url: string) {
    localStorage.setItem(DB_KEYS.BANNER, url);
    this.sync();
  }

  static getPaymentConfig() {
    return {
      qr: localStorage.getItem(DB_KEYS.QR_CODE) || '',
      recipient: localStorage.getItem(DB_KEYS.RECIPIENT) || 'Ranjit Rishidev',
      instructions: localStorage.getItem(DB_KEYS.INSTRUCTIONS) || "ये QR CODE को Scan करके पेमेंट करें। \nपेमेंट के बाद 'Proceed Payment' बटन दबाएं।"
    };
  }

  static setPaymentConfig(config: { qr: string, recipient: string, instructions: string }) {
    localStorage.setItem(DB_KEYS.QR_CODE, config.qr);
    localStorage.setItem(DB_KEYS.RECIPIENT, config.recipient);
    localStorage.setItem(DB_KEYS.INSTRUCTIONS, config.instructions);
    this.sync();
  }

  private static sync() {
    window.dispatchEvent(new Event('storage'));
  }
}

export default VaultDB;
