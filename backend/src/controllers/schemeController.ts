import { Request, Response } from 'express';
import { GovernmentScheme } from '../models/GovernmentScheme.js';
import { isMongoConnected } from '../config/db.js';

export const fallbackSchemes = [
  {
    _id: 'scheme-1',
    id: 'scheme-1',
    title: 'PM-KISAN Samman Nidhi Yojana',
    category: 'Financial Assistance',
    description: 'Direct income support of ₹6,000 per year in three equal installments of ₹2,000 directly into the bank accounts of small and marginal farmer families.',
    eligibility: ['All landholding farmer families having cultivable land in their names.', 'Valid Aadhaar linked with active bank account.'],
    benefits: '₹6,000 per year direct benefit transfer (DBT).',
    documentsRequired: ['Aadhaar Card', 'Land Ownership Records (Khasra/Khatauni)', 'Bank Passbook'],
    applicationUrl: 'https://pmkisan.gov.in',
    officialSource: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
  },
  {
    _id: 'scheme-2',
    id: 'scheme-2',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Crop Insurance',
    description: 'Comprehensive crop insurance covering risk from pre-sowing to post-harvest losses due to non-preventable natural risks.',
    eligibility: ['All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.'],
    benefits: 'Max premium payable by farmers is 2% for Kharif, 1.5% for Rabi, and 5% for Annual Horticultural crops.',
    documentsRequired: ['Land Possession Certificate', 'Sowing Certificate', 'Aadhaar Card', 'Bank Account details'],
    applicationUrl: 'https://pmfby.gov.in',
    officialSource: 'PMFBY National Portal',
  },
  {
    _id: 'scheme-3',
    id: 'scheme-3',
    title: 'Kisan Credit Card (KCC) Scheme',
    category: 'Agricultural Credit',
    description: 'Provides timely and hassle-free credit to farmers for agricultural operations and post-harvest expenses at subsidized interest rates.',
    eligibility: ['Individual/Joint borrowers, Tenant farmers, Oral lessees, Self Help Groups (SHGs).'],
    benefits: 'Concessional interest rate of 4% per annum (with prompt repayment incentive of 3%). Credit limit up to ₹3 Lakh without collateral.',
    documentsRequired: ['Application Form', 'ID & Address Proof', 'Land Registry Documents'],
    applicationUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    officialSource: 'Reserve Bank of India & NABARD',
  },
  {
    _id: 'scheme-4',
    id: 'scheme-4',
    title: 'Soil Health Card Scheme',
    category: 'Soil & Seed Testing',
    description: 'Provides crop-wise recommendations of nutrients and fertilizers required for individual farms to improve productivity and soil fertility.',
    eligibility: ['Open to all farmers across India.'],
    benefits: 'Free soil testing for 12 parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) every 2 years.',
    documentsRequired: ['Aadhaar Card', 'Soil Sample details'],
    applicationUrl: 'https://soilhealth.dac.gov.in',
    officialSource: 'Department of Agriculture & Farmers Welfare',
  },
  {
    _id: 'scheme-5',
    id: 'scheme-5',
    title: 'e-NAM (National Agriculture Market)',
    category: 'Marketplace Integration',
    description: 'Pan-India electronic trading portal networking existing APMC mandis to create a unified national market for agricultural commodities.',
    eligibility: ['Farmers registered with licensed APMC mandis.'],
    benefits: 'Transparent price discovery, online bidding, direct online payment into farmer bank account.',
    documentsRequired: ['Aadhaar Card', 'Bank Passbook', 'Mandi Registration ID'],
    applicationUrl: 'https://enam.gov.in',
    officialSource: 'Small Farmers Agribusiness Consortium (SFAC)',
  },
];

export const getSchemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    let schemes: any[] = [];

    if (isMongoConnected()) {
      try {
        const filter: any = {};
        if (category) filter.category = category;
        if (search) {
          filter.$or = [
            { title: { $regex: search as string, $options: 'i' } },
            { description: { $regex: search as string, $options: 'i' } },
          ];
        }
        schemes = await GovernmentScheme.find(filter).sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn('[MongoDB Scheme Query Warning]:', dbErr);
      }
    }

    if (!schemes || schemes.length === 0) {
      let filtered = [...fallbackSchemes];
      if (category) {
        filtered = filtered.filter((s) => s.category.toLowerCase().includes(String(category).toLowerCase()));
      }
      if (search) {
        const q = String(search).toLowerCase();
        filtered = filtered.filter(
          (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
        );
      }
      schemes = filtered;
    }

    res.status(200).json({ success: true, schemes });
  } catch (error: any) {
    res.status(200).json({ success: true, schemes: fallbackSchemes });
  }
};
