import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { CropListing } from '../models/CropListing.js';
import { Cart } from '../models/Cart.js';
import { Wishlist } from '../models/Wishlist.js';
import { Coupon } from '../models/Coupon.js';

export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { crop, category, district, state, isOrganic, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const filter: any = { status: 'AVAILABLE' };

    if (crop) filter.title = { $regex: crop as string, $options: 'i' };
    if (category) filter.cropCategory = { $regex: category as string, $options: 'i' };
    if (district) filter['location.district'] = { $regex: district as string, $options: 'i' };
    if (state) filter['location.state'] = { $regex: state as string, $options: 'i' };
    if (isOrganic === 'true') filter.isOrganic = true;
    if (minPrice || maxPrice) {
      filter.pricePerUnit = {};
      if (minPrice) filter.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerUnit.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const listings = await CropListing.find(filter)
      .populate('sellerId', 'name phone email avatar rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await CropListing.countDocuments(filter);

    res.status(200).json({
      success: true,
      listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getListingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await CropListing.findById(req.params.id).populate('sellerId', 'name phone email avatar rating');
    if (!listing) {
      res.status(404).json({ success: false, message: 'Crop listing not found.' });
      return;
    }
    res.status(200).json({ success: true, listing });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    const { title, cropCategory, variety, quantityAvailable, unit, pricePerUnit, minOrderQuantity, isOrganic, harvestDate, description, images, location } = req.body;

    const newListing = await CropListing.create({
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

    res.status(201).json({ success: true, message: 'Crop listing created successfully!', listing: newListing });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    const listing = await CropListing.findById(req.params.id);
    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found' });
      return;
    }
    if (listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Unauthorized to modify this listing' });
      return;
    }

    Object.assign(listing, req.body);
    await listing.save();

    res.status(200).json({ success: true, message: 'Listing updated successfully', listing });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    const listing = await CropListing.findById(req.params.id);
    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found' });
      return;
    }
    if (listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Unauthorized to delete this listing' });
      return;
    }

    listing.status = 'INACTIVE';
    await listing.save();

    res.status(200).json({ success: true, message: 'Listing deactivated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cart Management
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    let cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'items.listingId',
      populate: { path: 'sellerId', select: 'name phone location' },
    });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.status(200).json({ success: true, cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    const { listingId, quantity } = req.body;

    const listing = await CropListing.findById(listingId);
    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found' });
      return;
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const existingIdx = cart.items.findIndex((item) => item.listingId.toString() === listingId);
    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += Number(quantity);
    } else {
      cart.items.push({
        listingId,
        quantity: Number(quantity),
        pricePerUnit: listing.pricePerUnit,
      });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.listingId',
      populate: { path: 'sellerId', select: 'name phone' },
    });

    res.status(200).json({ success: true, message: 'Added to cart!', cart: updatedCart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    const { listingId } = req.params;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = cart.items.filter((item) => item.listingId.toString() !== listingId);
      await cart.save();
    }
    res.status(200).json({ success: true, message: 'Removed from cart' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Wishlist
export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('listings');
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, listings: [] });
    }
    res.status(200).json({ success: true, wishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    const { listingId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, listings: [] });
    }

    const idx = wishlist.listings.findIndex((id) => id.toString() === listingId);
    let isAdded = false;
    if (idx > -1) {
      wishlist.listings.splice(idx, 1);
    } else {
      wishlist.listings.push(listingId as any);
      isAdded = true;
    }

    await wishlist.save();
    res.status(200).json({ success: true, isAdded, message: isAdded ? 'Added to wishlist' : 'Removed from wishlist' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Coupon verification
export const verifyCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
