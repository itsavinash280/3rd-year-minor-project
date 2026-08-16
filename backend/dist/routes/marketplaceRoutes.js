import { Router } from 'express';
import { getListings, getListingById, createListing, updateListing, deleteListing, getCart, addToCart, removeFromCart, getWishlist, toggleWishlist, verifyCoupon, } from '../controllers/marketplaceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = Router();
// Public routes
router.get('/', getListings);
router.get('/:id', getListingById);
router.post('/coupons/verify', verifyCoupon);
// Protected routes
router.use(authenticateToken);
router.post('/', createListing);
router.put('/:id', updateListing);
router.delete('/:id', deleteListing);
// Cart
router.get('/user/cart', getCart);
router.post('/user/cart', addToCart);
router.delete('/user/cart/:listingId', removeFromCart);
// Wishlist
router.get('/user/wishlist', getWishlist);
router.post('/user/wishlist', toggleWishlist);
export default router;
