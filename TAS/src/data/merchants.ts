import type { Merchant } from '../components/MerchantCard';

// In real usage this list comes from GET /merchants, not a static file.
// Icon colors are generic stand-ins — see MerchantIcon.tsx note on logos.
export const sampleMerchants: Merchant[] = [
  { tur: 'TUR001', name: 'Amazon Pay', category: 'E-commerce', iconInitial: 'A', iconBackground: '#111827', iconColor: '#F59E0B' },
  { tur: 'TUR002', name: 'Flipkart', category: 'E-commerce', iconInitial: 'F', iconBackground: '#FEF3C7', iconColor: '#1D4ED8' },
  { tur: 'TUR003', name: 'Zomato', category: 'Food Delivery', iconInitial: 'Z', iconBackground: '#7F1D1D', iconColor: '#FFFFFF' },
  { tur: 'TUR004', name: 'Swiggy', category: 'Food Delivery', iconInitial: 'S', iconBackground: '#FB923C', iconColor: '#FFFFFF' },
  { tur: 'TUR005', name: 'Netflix', category: 'Entertainment', iconInitial: 'N', iconBackground: '#111827', iconColor: '#DC2626' },
  { tur: 'TUR006', name: 'Spotify', category: 'Music', iconInitial: 'S', iconBackground: '#166534', iconColor: '#FFFFFF' },
  { tur: 'TUR007', name: 'ApnaMart', category: 'Online Shopping', iconInitial: 'AM', iconBackground: '#EDE9FE', iconColor: '#6D28D9' },
];