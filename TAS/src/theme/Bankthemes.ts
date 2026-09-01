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
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa1Fho6GG_QT4RZvdYK1IPO7mP0cXYaHf9fXnWDos9DQ&s=10',
    colors: { primary: '#B71234', accent: '#F58220' },
  },
};