import { CropListing } from '../models/CropListing.js';
import { Cart } from '../models/Cart.js';
import { Wishlist } from '../models/Wishlist.js';
import { Coupon } from '../models/Coupon.js';
import { isMongoConnected } from '../config/db.js';
export const fallbackListings = [
    {
        _id: 'crop-1',
        id: 'crop-1',
        title: 'Sharbati Premium Wheat (Gehu)',
        cropCategory: 'Grains & Cereals',
        variety: 'HD-2967',
        quantityAvailable: 150,
        unit: 'QUINTAL',
        pricePerUnit: 2350,
        minOrderQuantity: 5,
        isOrganic: true,
        harvestDate: new Date().toISOString(),
        description: 'Certified organic Sharbati gold wheat with high protein content and golden luster.',
        images: ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'],
        location: { village: 'Kisanpur', district: 'Lucknow', state: 'Uttar Pradesh' },
        sellerId: { name: 'Ramashankar Yadav', phone: '+91 98765 00100', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', rating: 4.8 },
        rating: 4.8,
        totalReviews: 24,
        status: 'AVAILABLE',
    },
    {
        _id: 'crop-2',
        id: 'crop-2',
        title: 'Basmati Paddy / Rice (Dhan)',
        cropCategory: 'Grains & Cereals',
        variety: 'Pusa 1121',
        quantityAvailable: 200,
        unit: 'QUINTAL',
        pricePerUnit: 3400,
        minOrderQuantity: 5,
        isOrganic: false,
        harvestDate: new Date().toISOString(),
        description: 'Aromatic extra-long grain Basmati paddy grown in nutrient-rich alluvial plains.',
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
        location: { village: 'Tarauna', district: 'Kanpur', state: 'Uttar Pradesh' },
        sellerId: { name: 'Baldev Singh', phone: '+91 98765 00101', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', rating: 4.9 },
        rating: 4.9,
        totalReviews: 32,
        status: 'AVAILABLE',
    },
    {
        _id: 'crop-3',
        id: 'crop-3',
        title: 'Yellow Mustard Seeds (Sarson)',
        cropCategory: 'Oilseeds',
        variety: 'Pusa Bold',
        quantityAvailable: 80,
        unit: 'QUINTAL',
        pricePerUnit: 5800,
        minOrderQuantity: 2,
        isOrganic: true,
        harvestDate: new Date().toISOString(),
        description: 'High oil yield yellow mustard seeds, cold-pressed grade, 100% pesticide-free.',
        images: ['https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80'],
        location: { village: 'Malihabad', district: 'Lucknow', state: 'Uttar Pradesh' },
        sellerId: { name: 'Harish Chandra Patel', phone: '+91 98765 00102', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', rating: 4.7 },
        rating: 4.7,
        totalReviews: 18,
        status: 'AVAILABLE',
    },
    {
        _id: 'crop-4',
        id: 'crop-4',
        title: 'Hybrid Yellow Maize (Makka)',
        cropCategory: 'Grains & Cereals',
        variety: 'DeKalb 9081',
        quantityAvailable: 120,
        unit: 'QUINTAL',
        pricePerUnit: 2150,
        minOrderQuantity: 5,
        isOrganic: false,
        harvestDate: new Date().toISOString(),
        description: 'Premium moisture-controlled feed and processing grade yellow corn.',
        images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80'],
        location: { village: 'Banthra', district: 'Lucknow', state: 'Uttar Pradesh' },
        sellerId: { name: 'Shivratan Kushwaha', phone: '+91 98765 00103', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', rating: 4.6 },
        rating: 4.6,
        totalReviews: 15,
        status: 'AVAILABLE',
    },
    {
        _id: 'crop-5',
        id: 'crop-5',
        title: 'Organic Farm Fresh Tomatoes',
        cropCategory: 'Vegetables',
        variety: 'Pusa Ruby',
        quantityAvailable: 60,
        unit: 'QUINTAL',
        pricePerUnit: 1900,
        minOrderQuantity: 2,
        isOrganic: true,
        harvestDate: new Date().toISOString(),
        description: 'Vine-ripened red organic tomatoes packed with rich lycopene and natural sweetness.',
        images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
        location: { village: 'Kakori', district: 'Lucknow', state: 'Uttar Pradesh' },
        sellerId: { name: 'Sohanlal Maurya', phone: '+91 98765 00104', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', rating: 4.9 },
        rating: 4.9,
        totalReviews: 29,
        status: 'AVAILABLE',
    },
    {
        _id: 'crop-6',
        id: 'crop-6',
        title: 'Fresh Red Potatoes (Aalu)',
        cropCategory: 'Vegetables',
        variety: 'Kufri Jyoti',
        quantityAvailable: 300,
        unit: 'QUINTAL',
        pricePerUnit: 1450,
        minOrderQuantity: 10,
        isOrganic: false,
        harvestDate: new Date().toISOString(),
        description: 'Cleaned, graded, uniform size red skin table potatoes with great shelf life.',
        images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80'],
        location: { village: 'Farrukhabad', district: 'Kanpur', state: 'Uttar Pradesh' },
        sellerId: { name: 'Jagdish Prasad', phone: '+91 98765 00105', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', rating: 4.7 },
        rating: 4.7,
        totalReviews: 41,
        status: 'AVAILABLE',
    },
];
export const getListings = async (req, res) => {
    try {
        const { crop, category, district, state, isOrganic, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
        let listings = [];
        let total = 0;
        if (isMongoConnected()) {
            try {
                const filter = { status: 'AVAILABLE' };
                if (crop)
                    filter.title = { $regex: crop, $options: 'i' };
                if (category)
                    filter.cropCategory = { $regex: category, $options: 'i' };
                if (district)
                    filter['location.district'] = { $regex: district, $options: 'i' };
                if (state)
                    filter['location.state'] = { $regex: state, $options: 'i' };
                if (isOrganic === 'true')
                    filter.isOrganic = true;
                if (minPrice || maxPrice) {
                    filter.pricePerUnit = {};
                    if (minPrice)
                        filter.pricePerUnit.$gte = Number(minPrice);
                    if (maxPrice)
                        filter.pricePerUnit.$lte = Number(maxPrice);
                }
                const skip = (Number(page) - 1) * Number(limit);
                listings = await CropListing.find(filter)
                    .populate('sellerId', 'name phone email avatar rating')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(Number(limit));
                total = await CropListing.countDocuments(filter);
            }
            catch (dbErr) {
                console.warn('[MongoDB Get Listings Fallback]:', dbErr);
            }
        }
        if (!listings || listings.length === 0) {
            let filtered = [...fallbackListings];
            if (crop) {
                const q = String(crop).toLowerCase();
                filtered = filtered.filter((l) => l.title.toLowerCase().includes(q));
            }
            if (category) {
                const c = String(category).toLowerCase();
                filtered = filtered.filter((l) => l.cropCategory.toLowerCase().includes(c));
            }
            if (district) {
                const d = String(district).toLowerCase();
                filtered = filtered.filter((l) => l.location.district.toLowerCase().includes(d));
            }
            if (isOrganic === 'true') {
                filtered = filtered.filter((l) => l.isOrganic);
            }
            if (minPrice) {
                filtered = filtered.filter((l) => l.pricePerUnit >= Number(minPrice));
            }
            if (maxPrice) {
                filtered = filtered.filter((l) => l.pricePerUnit <= Number(maxPrice));
            }
            total = filtered.length;
            const skip = (Number(page) - 1) * Number(limit);
            listings = filtered.slice(skip, skip + Number(limit));
        }
        res.status(200).json({
            success: true,
            listings,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit)) || 1,
            },
        });
    }
    catch (error) {
        res.status(200).json({
            success: true,
            listings: fallbackListings,
            pagination: {
                page: 1,
                limit: 12,
                total: fallbackListings.length,
                totalPages: 1,
            },
        });
    }
};
export const getListingById = async (req, res) => {
    try {
        let listing = null;
        if (isMongoConnected()) {
            try {
                listing = await CropListing.findById(req.params.id).populate('sellerId', 'name phone email avatar rating');
            }
            catch (dbErr) {
                console.warn('[MongoDB Get Listing ID Fallback]:', dbErr);
            }
        }
        if (!listing) {
            listing = fallbackListings.find((l) => l._id === req.params.id || l.id === req.params.id);
        }
        if (!listing) {
            res.status(404).json({ success: false, message: 'Crop listing not found.' });
            return;
        }
        res.status(200).json({ success: true, listing });
    }
    catch (error) {
        const listing = fallbackListings[0];
        res.status(200).json({ success: true, listing });
    }
};
export const inMemoryListings = [];
export const inMemoryCarts = new Map();
export const inMemoryWishlists = new Map();
export const fallbackCoupons = [
    { code: 'KRISHI10', discountPercent: 10, maxDiscountAmount: 500, minOrderValue: 1000, isActive: true },
    { code: 'BUMPER15', discountPercent: 15, maxDiscountAmount: 1200, minOrderValue: 2500, isActive: true },
    { code: 'FARM50', discountPercent: 5, maxDiscountAmount: 250, minOrderValue: 500, isActive: true },
];
export const createListing = async (req, res) => {
    try {
        if (!req.user)
            return;
        const { title, cropCategory, variety, quantityAvailable, unit, pricePerUnit, minOrderQuantity, isOrganic, harvestDate, description, images, location } = req.body;
        let newListing = null;
        if (isMongoConnected()) {
            try {
                newListing = await CropListing.create({
                    sellerId: req.user._id,
                    title,
                    cropCategory: cropCategory || 'Grains & Cereals',
                    variety: variety || 'Standard',
                    quantityAvailable: Number(quantityAvailable),
                    unit: unit || 'QUINTAL',
                    pricePerUnit: Number(pricePerUnit),
                    minOrderQuantity: Number(minOrderQuantity || 1),
                    isOrganic: Boolean(isOrganic),
                    harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
                    description,
                    images: images && images.length ? images : ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'],
                    location: location || { village: 'Malihabad', district: 'Lucknow', state: 'Uttar Pradesh' },
                });
            }
            catch (dbErr) {
                console.warn('[MongoDB Create Listing Fallback]:', dbErr);
            }
        }
        if (!newListing) {
            newListing = {
                _id: 'crop-' + Date.now(),
                id: 'crop-' + Date.now(),
                sellerId: {
                    _id: req.user._id || req.user.id,
                    name: req.user.name,
                    phone: req.user.phone || '+91 98765 00000',
                    avatar: req.user.avatar,
                    rating: 4.9,
                },
                title,
                cropCategory: cropCategory || 'Grains & Cereals',
                variety: variety || 'Standard',
                quantityAvailable: Number(quantityAvailable),
                unit: unit || 'QUINTAL',
                pricePerUnit: Number(pricePerUnit),
                minOrderQuantity: Number(minOrderQuantity || 1),
                isOrganic: Boolean(isOrganic),
                harvestDate: harvestDate ? new Date(harvestDate).toISOString() : new Date().toISOString(),
                description: description || 'Fresh farm harvest.',
                images: images && images.length ? images : ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'],
                location: location || { village: 'Malihabad', district: 'Lucknow', state: 'Uttar Pradesh' },
                status: 'AVAILABLE',
                rating: 5.0,
                totalReviews: 1,
                createdAt: new Date(),
            };
            inMemoryListings.unshift(newListing);
            fallbackListings.unshift(newListing);
        }
        res.status(201).json({ success: true, message: 'Crop listing created successfully!', listing: newListing });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const updateListing = async (req, res) => {
    try {
        if (!req.user)
            return;
        let listing = null;
        if (isMongoConnected()) {
            try {
                listing = await CropListing.findById(req.params.id);
                if (listing) {
                    if (listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
                        res.status(403).json({ success: false, message: 'Unauthorized to modify this listing' });
                        return;
                    }
                    Object.assign(listing, req.body);
                    await listing.save();
                }
            }
            catch (dbErr) {
                console.warn('[MongoDB Update Listing Fallback]:', dbErr);
            }
        }
        if (!listing) {
            listing = fallbackListings.find((l) => l._id === req.params.id || l.id === req.params.id);
            if (listing) {
                Object.assign(listing, req.body);
            }
        }
        if (!listing) {
            res.status(404).json({ success: false, message: 'Listing not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Listing updated successfully', listing });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteListing = async (req, res) => {
    try {
        if (!req.user)
            return;
        let listing = null;
        if (isMongoConnected()) {
            try {
                listing = await CropListing.findById(req.params.id);
                if (listing) {
                    if (listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
                        res.status(403).json({ success: false, message: 'Unauthorized to delete this listing' });
                        return;
                    }
                    listing.status = 'INACTIVE';
                    await listing.save();
                }
            }
            catch (dbErr) {
                console.warn('[MongoDB Delete Listing Fallback]:', dbErr);
            }
        }
        if (!listing) {
            const idx = fallbackListings.findIndex((l) => l._id === req.params.id || l.id === req.params.id);
            if (idx > -1) {
                fallbackListings[idx].status = 'INACTIVE';
            }
        }
        res.status(200).json({ success: true, message: 'Listing deactivated successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Cart Management
export const getCart = async (req, res) => {
    try {
        if (!req.user)
            return;
        const userId = req.user._id ? req.user._id.toString() : req.user.id;
        let cart = null;
        if (isMongoConnected()) {
            try {
                cart = await Cart.findOne({ userId: req.user._id }).populate({
                    path: 'items.listingId',
                    populate: { path: 'sellerId', select: 'name phone location' },
                });
                if (!cart) {
                    cart = await Cart.create({ userId: req.user._id, items: [] });
                }
            }
            catch (dbErr) {
                console.warn('[MongoDB Get Cart Fallback]:', dbErr);
            }
        }
        if (!cart) {
            cart = inMemoryCarts.get(userId) || { userId, items: [] };
            inMemoryCarts.set(userId, cart);
        }
        res.status(200).json({ success: true, cart });
    }
    catch (error) {
        res.status(200).json({ success: true, cart: { items: [] } });
    }
};
export const addToCart = async (req, res) => {
    try {
        if (!req.user)
            return;
        const { listingId, quantity } = req.body;
        const userId = req.user._id ? req.user._id.toString() : req.user.id;
        let listing = fallbackListings.find((l) => l._id === listingId || l.id === listingId);
        if (isMongoConnected()) {
            try {
                const dbListing = await CropListing.findById(listingId);
                if (dbListing)
                    listing = dbListing;
                let cart = await Cart.findOne({ userId: req.user._id });
                if (!cart) {
                    cart = await Cart.create({ userId: req.user._id, items: [] });
                }
                const existingIdx = cart.items.findIndex((item) => item.listingId.toString() === listingId);
                if (existingIdx > -1) {
                    cart.items[existingIdx].quantity += Number(quantity);
                }
                else {
                    cart.items.push({
                        listingId,
                        quantity: Number(quantity),
                        pricePerUnit: listing ? listing.pricePerUnit : 2000,
                    });
                }
                await cart.save();
                const updatedCart = await Cart.findById(cart._id).populate({
                    path: 'items.listingId',
                    populate: { path: 'sellerId', select: 'name phone' },
                });
                res.status(200).json({ success: true, message: 'Added to cart!', cart: updatedCart });
                return;
            }
            catch (dbErr) {
                console.warn('[MongoDB Add to Cart Fallback]:', dbErr);
            }
        }
        // In-memory fallback
        let cart = inMemoryCarts.get(userId) || { userId, items: [] };
        const existingIdx = cart.items.findIndex((item) => item.listingId === listingId || item.listingId?._id === listingId);
        if (existingIdx > -1) {
            cart.items[existingIdx].quantity += Number(quantity);
        }
        else {
            cart.items.push({
                listingId: listing || { _id: listingId, title: 'Agricultural Crop', pricePerUnit: 2000 },
                quantity: Number(quantity),
                pricePerUnit: listing ? listing.pricePerUnit : 2000,
            });
        }
        inMemoryCarts.set(userId, cart);
        res.status(200).json({ success: true, message: 'Added to cart!', cart });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const removeFromCart = async (req, res) => {
    try {
        if (!req.user)
            return;
        const { listingId } = req.params;
        const userId = req.user._id ? req.user._id.toString() : req.user.id;
        if (isMongoConnected()) {
            try {
                const cart = await Cart.findOne({ userId: req.user._id });
                if (cart) {
                    cart.items = cart.items.filter((item) => item.listingId.toString() !== listingId);
                    await cart.save();
                }
            }
            catch (dbErr) {
                console.warn('[MongoDB Remove Cart Fallback]:', dbErr);
            }
        }
        let cart = inMemoryCarts.get(userId);
        if (cart) {
            cart.items = cart.items.filter((item) => (item.listingId?._id || item.listingId) !== listingId);
            inMemoryCarts.set(userId, cart);
        }
        res.status(200).json({ success: true, message: 'Removed from cart' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Wishlist
export const getWishlist = async (req, res) => {
    try {
        if (!req.user)
            return;
        const userId = req.user._id ? req.user._id.toString() : req.user.id;
        let wishlist = null;
        if (isMongoConnected()) {
            try {
                wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('listings');
                if (!wishlist) {
                    wishlist = await Wishlist.create({ userId: req.user._id, listings: [] });
                }
            }
            catch (dbErr) {
                console.warn('[MongoDB Get Wishlist Fallback]:', dbErr);
            }
        }
        if (!wishlist) {
            const items = inMemoryWishlists.get(userId) || [];
            wishlist = { userId, listings: items };
        }
        res.status(200).json({ success: true, wishlist });
    }
    catch (error) {
        res.status(200).json({ success: true, wishlist: { listings: [] } });
    }
};
export const toggleWishlist = async (req, res) => {
    try {
        if (!req.user)
            return;
        const { listingId } = req.body;
        const userId = req.user._id ? req.user._id.toString() : req.user.id;
        let isAdded = false;
        if (isMongoConnected()) {
            try {
                let wishlist = await Wishlist.findOne({ userId: req.user._id });
                if (!wishlist) {
                    wishlist = await Wishlist.create({ userId: req.user._id, listings: [] });
                }
                const idx = wishlist.listings.findIndex((id) => id.toString() === listingId);
                if (idx > -1) {
                    wishlist.listings.splice(idx, 1);
                }
                else {
                    wishlist.listings.push(listingId);
                    isAdded = true;
                }
                await wishlist.save();
                res.status(200).json({ success: true, isAdded, message: isAdded ? 'Added to wishlist' : 'Removed from wishlist' });
                return;
            }
            catch (dbErr) {
                console.warn('[MongoDB Toggle Wishlist Fallback]:', dbErr);
            }
        }
        let items = inMemoryWishlists.get(userId) || [];
        const idx = items.findIndex((i) => (i._id || i) === listingId);
        if (idx > -1) {
            items.splice(idx, 1);
            isAdded = false;
        }
        else {
            const found = fallbackListings.find((l) => l._id === listingId || l.id === listingId);
            items.push(found || { _id: listingId, title: 'Crop Item' });
            isAdded = true;
        }
        inMemoryWishlists.set(userId, items);
        res.status(200).json({ success: true, isAdded, message: isAdded ? 'Added to wishlist' : 'Removed from wishlist' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Coupon verification
export const verifyCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        let coupon = null;
        if (isMongoConnected()) {
            try {
                coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
            }
            catch (dbErr) {
                console.warn('[MongoDB Coupon Query Fallback]:', dbErr);
            }
        }
        if (!coupon) {
            coupon = fallbackCoupons.find((c) => c.code === code?.toUpperCase());
        }
        if (!coupon) {
            res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
            return;
        }
        if (cartTotal < coupon.minOrderValue) {
            res.status(400).json({
                success: false,
                message: `Minimum order value for coupon ${coupon.code} is ₹${coupon.minOrderValue}`,
            });
            return;
        }
        let discount = (cartTotal * coupon.discountPercent) / 100;
        if (discount > coupon.maxDiscountAmount) {
            discount = coupon.maxDiscountAmount;
        }
        res.status(200).json({
            success: true,
            code: coupon.code,
            discountAmount: discount,
            message: `Coupon Applied! Saved ₹${discount}`,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
