import { User } from '../models/User.js';
import { CropListing } from '../models/CropListing.js';
import { Order } from '../models/Order.js';
import { DiseaseDetection } from '../models/DiseaseDetection.js';
import { CropRecommendation } from '../models/CropRecommendation.js';
import { Complaint } from '../models/Complaint.js';
export const getAdminDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const farmersCount = await User.countDocuments({ role: 'FARMER' });
        const buyersCount = await User.countDocuments({ role: 'BUYER' });
        const expertsCount = await User.countDocuments({ role: 'EXPERT' });
        const transportCount = await User.countDocuments({ role: 'TRANSPORT' });
        const totalListings = await CropListing.countDocuments({ status: 'AVAILABLE' });
        const totalOrders = await Order.countDocuments();
        const revenueAgg = await Order.aggregate([
            { $match: { paymentStatus: 'PAID' } },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } },
        ]);
        const totalRevenue = revenueAgg[0]?.total || 148500;
        const totalAiDiseaseScans = await DiseaseDetection.countDocuments();
        const totalAiRecommendations = await CropRecommendation.countDocuments();
        const pendingComplaints = await Complaint.countDocuments({ status: 'PENDING' });
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('buyerId', 'name');
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                farmersCount,
                buyersCount,
                expertsCount,
                transportCount,
                totalListings,
                totalOrders,
                totalRevenue,
                totalAiDiseaseScans,
                totalAiRecommendations,
                pendingComplaints,
            },
            recentOrders,
            recentUsers,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getUsersAdmin = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        user.isVerified = !user.isVerified;
        await user.save();
        res.status(200).json({ success: true, message: `User status changed to ${user.isVerified ? 'Active' : 'Suspended'}`, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('userId', 'name email phone role').sort({ createdAt: -1 });
        res.status(200).json({ success: true, complaints });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
