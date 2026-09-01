import type { Merchant } from '../components/MerchantCard';

// In real usage this list comes from GET /merchants, not a static file.
// Add each merchant's official logoUrl (from your CDN or their brand kit)
// once available — iconInitial/iconBackground/iconColor remain as the
// fallback whenever logoUrl is missing or fails to load.
export const sampleMerchants: Merchant[] = [
  { tur: 'TUR001', name: 'Amazon Pay', category: 'E-commerce', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi6U-KSnY_r4hsTsVxDuaaM1suHkBJRHcyaf65xF5PJQ&s=10', iconInitial: 'A', iconBackground: '#111827', iconColor: '#F59E0B' },
  { tur: 'TUR002', name: 'Flipkart', category: 'E-commerce', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJm8hC2tO7veDcOR-uEEKXnpBNamiosUqoR4tYrr9NFA&s=10', iconInitial: 'F', iconBackground: '#FEF3C7', iconColor: '#1D4ED8' },
  { tur: 'TUR003', name: 'Zomato', category: 'Food Delivery', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSitsTs8FboUAlsOs9T0b_EjigLJQmHnL4rjevZQde2cA&s', iconInitial: 'Z', iconBackground: '#7F1D1D', iconColor: '#FFFFFF' },
  { tur: 'TUR004', name: 'Swiggy', category: 'Food Delivery', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQEB7KfnFU3uJgK4zEQl24r9KjqydLdbIwRdOuQsdD_Q&s=10', iconInitial: 'S', iconBackground: '#FB923C', iconColor: '#FFFFFF' },
  { tur: 'TUR005', name: 'Netflix', category: 'Entertainment', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoMznz1zJ3fNTFggg26u-HrG1L7P1uQHJ4uqv7cishUA&s=10', iconInitial: 'N', iconBackground: '#111827', iconColor: '#DC2626' },
  { tur: 'TUR006', name: 'Spotify', category: 'Music', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpunUgf2FwwRgBsTqAw2B0KXeXuROKaPNgfAwyuuVLwg&s=10', iconInitial: 'S', iconBackground: '#166534', iconColor: '#FFFFFF' },
  { tur: 'TUR007', name: 'ApnaMart', category: 'Online Shopping', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKNWpGBED-NZXs-rpnlgFPSp9F64-eaWfQSfcM4pnIHg&s=10', iconInitial: 'AM', iconBackground: '#EDE9FE', iconColor: '#6D28D9' },
];