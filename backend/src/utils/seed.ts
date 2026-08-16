import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { FarmerProfile } from '../models/FarmerProfile.js';
import { CropListing } from '../models/CropListing.js';
import { Order } from '../models/Order.js';
import { MarketPrice } from '../models/MarketPrice.js';
import { GovernmentScheme } from '../models/GovernmentScheme.js';
import { Coupon } from '../models/Coupon.js';
import { ExpertConsultation } from '../models/ExpertConsultation.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/asraverse';

export const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await FarmerProfile.deleteMany({});
    await CropListing.deleteMany({});
    await Order.deleteMany({});
    await MarketPrice.deleteMany({});
    await GovernmentScheme.deleteMany({});
    await Coupon.deleteMany({});
    await ExpertConsultation.deleteMany({});

    console.log('[Seed] Cleared old collections.');

    const defaultPassword = await bcrypt.hash('Password@123', 10);

    // 1. Create Admin
    const admin = await User.create({
      name: 'Dr. Ramesh Sharma (Admin)',
      email: 'admin@asraverse.in',
      phone: '+91 98765 00001',
      password: defaultPassword,
      role: 'ADMIN',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });

    // 2. Create Experts (3)
    const experts = await User.insertMany([
      {
        name: 'Dr. Anita Verma (Agronomist)',
        email: 'anita.verma@kvk.org.in',
        phone: '+91 98765 00002',
        password: defaultPassword,
        role: 'EXPERT',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Prof. Rajesh Kumar (Plant Pathologist)',
        email: 'rajesh.pathology@nau.edu.in',
        phone: '+91 98765 00003',
        password: defaultPassword,
        role: 'EXPERT',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Dr. Suresh Patel (Soil Scientist)',
        email: 'suresh.soil@icar.gov.in',
        phone: '+91 98765 00004',
        password: defaultPassword,
        role: 'EXPERT',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      },
    ]);

    // 3. Create Transport Partners (3)
    const transport = await User.insertMany([
      {
        name: 'Kisaan Express Logistics (Ramesh)',
        email: 'logistics.ramesh@express.in',
        phone: '+91 98765 00005',
        password: defaultPassword,
        role: 'TRANSPORT',
        isVerified: true,
      },
      {
        name: 'AgroSpeed Freight (Gurpreet Singh)',
        email: 'gurpreet@agrospeed.in',
        phone: '+91 98765 00006',
        password: defaultPassword,
        role: 'TRANSPORT',
        isVerified: true,
      },
      {
        name: 'Gramin Cargo Movers (Vikram)',
        email: 'vikram@gramincargo.in',
        phone: '+91 98765 00007',
        password: defaultPassword,
        role: 'TRANSPORT',
        isVerified: true,
      },
    ]);

    // 4. Create Buyers (5)
    const buyers = await User.insertMany([
      {
        name: 'Organic Harvest Wholesalers',
        email: 'buyer.organic@harvest.com',
        phone: '+91 98765 00010',
        password: defaultPassword,
        role: 'BUYER',
        isVerified: true,
      },
      {
        name: 'Lucknow Grain Traders Association',
        email: 'trader.lucknow@grain.org',
        phone: '+91 98765 00011',
        password: defaultPassword,
        role: 'BUYER',
        isVerified: true,
      },
      {
        name: 'Green Basket Retail Mart',
        email: 'procurement@greenbasket.in',
        phone: '+91 98765 00012',
        password: defaultPassword,
        role: 'BUYER',
        isVerified: true,
      },
      {
        name: 'Kanpur Agro Processors Ltd',
        email: 'supply@kanpuragro.com',
        phone: '+91 98765 00013',
        password: defaultPassword,
        role: 'BUYER',
        isVerified: true,
      },
      {
        name: 'Pooja Supermarket Chain',
        email: 'buyer@poojasuper.com',
        phone: '+91 98765 00014',
        password: defaultPassword,
        role: 'BUYER',
        isVerified: true,
      },
    ]);

    // 5. Create Farmers (10)
    const farmerNames = [
      'Ramashankar Yadav',
      'Baldev Singh',
      'Harish Chandra Patel',
      'Shivratan Kushwaha',
      'Sohanlal Maurya',
      'Jagdish Prasad',
      'Mukesh Chaudhari',
      'Dhananjay Tiwari',
      'Ramsevak Verma',
      'Bhagwandas Saini',
    ];

    const farmers = [];
    for (let i = 0; i < farmerNames.length; i++) {
      const u = await User.create({
        name: farmerNames[i],
        email: `farmer${i + 1}@asraverse.in`,
        phone: `+91 98765 0010${i}`,
        password: defaultPassword,
        role: 'FARMER',
        isVerified: true,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?auto=format&fit=crop&w=150&q=80`,
      });
      farmers.push(u);

      await FarmerProfile.create({
        userId: u._id,
        farmName: `${farmerNames[i].split(' ')[0]}'s Asra Farm`,
        farmSize: 4 + i * 2,
        sizeUnit: 'ACRES',
        soilType: i % 2 === 0 ? 'ALLUVIAL' : 'LOAM',
        soilPh: 6.5 + (i % 4) * 0.2,
        nitrogen: 130 + i * 5,
        phosphorus: 40 + i * 2,
        potassium: 38 + i * 2,
        irrigationMethod: i % 3 === 0 ? 'CANAL' : i % 3 === 1 ? 'BOREWELL' : 'DRIP',
        state: 'Uttar Pradesh',
        district: i % 2 === 0 ? 'Lucknow' : 'Kanpur',
        village: `Kisanpur Sector ${i + 1}`,
        pincode: `22600${i + 1}`,
        cropsGrown: ['Wheat', 'Paddy', 'Mustard', 'Tomato'],
        farmingExperienceYears: 6 + i,
        aadhaarMasked: `XXXX-XXXX-980${i}`,
      });
    }

    console.log(`[Seed] Seeded Users: 1 Admin, 3 Experts, 3 Transports, 5 Buyers, 10 Farmers.`);

    // 6. Create Crop Listings (20)
    const cropTemplates = [
      { title: 'Sharbati Premium Wheat (Gehu)', category: 'Grains & Cereals', variety: 'HD-2967', price: 2350, unit: 'QUINTAL', qty: 150, organic: true, img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80' },
      { title: 'Basmati Paddy / Rice (Dhan)', category: 'Grains & Cereals', variety: 'Pusa 1121', price: 3400, unit: 'QUINTAL', qty: 200, organic: false, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
      { title: 'Yellow Mustard Seeds (Sarson)', category: 'Oilseeds', variety: 'Pusa Bold', price: 5800, unit: 'QUINTAL', qty: 80, organic: true, img: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80' },
      { title: 'Hybrid Yellow Maize (Makka)', category: 'Grains & Cereals', variety: 'DeKalb 9081', price: 2150, unit: 'QUINTAL', qty: 120, organic: false, img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80' },
      { title: 'Organic Farm Tomatoes', category: 'Vegetables', variety: 'Pusa Ruby', price: 1900, unit: 'QUINTAL', qty: 60, organic: true, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
      { title: 'Fresh Red Potatoes (Aalu)', category: 'Vegetables', variety: 'Kufri Jyoti', price: 1450, unit: 'QUINTAL', qty: 300, organic: false, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80' },
      { title: 'Nasik Red Onions (Pyaz)', category: 'Vegetables', variety: 'AgriFound Dark Red', price: 2200, unit: 'QUINTAL', qty: 180, organic: false, img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80' },
      { title: 'Organic Desi Chickpeas (Chana)', category: 'Pulses', variety: 'JG-11', price: 5200, unit: 'QUINTAL', qty: 90, organic: true, img: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80' },
      { title: 'Fresh Green Peas (Matar)', category: 'Vegetables', variety: 'Arkel', price: 3100, unit: 'QUINTAL', qty: 50, organic: true, img: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=800&q=80' },
      { title: 'Pure Sugarcane Stalks', category: 'Commercial Crops', variety: 'Co 0238', price: 360, unit: 'QUINTAL', qty: 500, organic: false, img: 'https://images.unsplash.com/photo-1527847263472-aa5338d178b8?auto=format&fit=crop&w=800&q=80' },
    ];

    const listings = [];
    for (let i = 0; i < 20; i++) {
      const template = cropTemplates[i % cropTemplates.length];
      const seller = farmers[i % farmers.length];
      const listing = await CropListing.create({
        sellerId: seller._id,
        title: `${template.title} #${i + 1}`,
        cropCategory: template.category,
        variety: template.variety,
        quantityAvailable: template.qty + i * 5,
        unit: template.unit as any,
        pricePerUnit: template.price + (i % 3) * 50,
        minOrderQuantity: 5,
        isOrganic: template.organic,
        harvestDate: new Date(),
        description: `Premium quality ${template.title} harvested directly from ${seller.name}'s verified farm in Uttar Pradesh. Tested for purity and high germination/consumption standards.`,
        images: [template.img],
        location: {
          village: `Kisanpur Village ${i + 1}`,
          district: i % 2 === 0 ? 'Lucknow' : 'Kanpur',
          state: 'Uttar Pradesh',
          lat: 26.8467 + i * 0.01,
          lng: 80.9462 + i * 0.01,
        },
        status: 'AVAILABLE',
        rating: 4.6 + (i % 4) * 0.1,
        totalReviews: 14 + i * 2,
      });
      listings.push(listing);
    }

    console.log(`[Seed] Seeded 20 Crop Listings.`);

    // 7. Create Orders (10)
    for (let i = 0; i < 10; i++) {
      const buyer = buyers[i % buyers.length];
      const listing = listings[i];
      const qty = 10 + i * 2;
      const total = listing.pricePerUnit * qty;

      const order = await Order.create({
        buyerId: buyer._id,
        sellerId: listing.sellerId,
        items: [
          {
            listingId: listing._id,
            title: listing.title,
            quantity: qty,
            unit: listing.unit,
            pricePerUnit: listing.pricePerUnit,
            totalPrice: total,
          },
        ],
        totalAmount: total,
        discountAmount: 200,
        finalAmount: total - 200,
        couponCode: 'KRISHI10',
        deliveryAddress: {
          fullName: buyer.name,
          phone: buyer.phone,
          street: 'Plot 45, Agro Mandi Complex',
          village: 'Central Mandi',
          district: 'Lucknow',
          state: 'Uttar Pradesh',
          pincode: '226001',
        },
        orderStatus: i % 3 === 0 ? 'DELIVERED' : i % 3 === 1 ? 'SHIPPED' : 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod: 'UPI',
        razorpayOrderId: `order_rzp_seed_${i + 1}`,
        razorpayPaymentId: `pay_rzp_seed_${i + 1}`,
        trackingNumber: `KS-TRK-${900000 + i}`,
      });
    }

    console.log(`[Seed] Seeded 10 Orders.`);

    // 8. Create Government Schemes
    await GovernmentScheme.insertMany([
      {
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
        title: 'e-NAM (National Agriculture Market)',
        category: 'Marketplace Integration',
        description: 'Pan-India electronic trading portal networking existing APMC mandis to create a unified national market for agricultural commodities.',
        eligibility: ['Farmers registered with licensed APMC mandis.'],
        benefits: 'Transparent price discovery, online bidding, direct online payment into farmer bank account.',
        documentsRequired: ['Aadhaar Card', 'Bank Passbook', 'Mandi Registration ID'],
        applicationUrl: 'https://enam.gov.in',
        officialSource: 'Small Farmers Agribusiness Consortium (SFAC)',
      },
    ]);

    console.log(`[Seed] Seeded Government Schemes.`);

    // 9. Create Coupons
    await Coupon.insertMany([
      { code: 'KRISHI10', discountPercent: 10, maxDiscountAmount: 500, minOrderValue: 1000, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
      { code: 'BUMPER15', discountPercent: 15, maxDiscountAmount: 1200, minOrderValue: 2500, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
      { code: 'FARM50', discountPercent: 5, maxDiscountAmount: 250, minOrderValue: 500, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
    ]);

    console.log(`[Seed] Seeded Coupons.`);
    console.log('[Seed] Database seeding completed successfully! 🎉');
    await mongoose.disconnect();
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};

seedDatabase();

