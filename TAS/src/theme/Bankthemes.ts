import type { BankThemeInput } from './Banktheme.types';

export const bankThemes: Record<string, BankThemeInput> = {
  SR1: {
    sourceid: 'SR1',
    bankName: 'HDFC Bank',
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOPEUzn9e5UF3D_qLEZN8lu-VY8zGXGN-22s_VY5AuA&s=10',
    colors: { primary: '#004C8F', accent: '#00A99D' },
  },
  SR2: {
    sourceid: 'SR2',
    bankName: 'ICICI Bank',
    logoUrl: 'https://cdn.tas.example.com/logos/sr2.svg',
    colors: { primary: '#B71234', accent: '#F58220' },
  },
};