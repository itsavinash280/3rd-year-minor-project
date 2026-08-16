import { ExpertConsultation } from '../models/ExpertConsultation.js';
import { User } from '../models/User.js';
export const getConsultations = async (req, res) => {
    try {
        if (!req.user)
            return;
        let filter = {};
        if (req.user.role === 'FARMER') {
            filter = { farmerId: req.user._id };
        }
        else if (req.user.role === 'EXPERT') {
            filter = { $or: [{ expertId: req.user._id }, { status: 'OPEN' }] };
        }
        const consultations = await ExpertConsultation.find(filter)
            .populate('farmerId', 'name phone avatar')
            .populate('expertId', 'name email avatar')
            .populate('diseaseDetectionId')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, consultations });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const createConsultation = async (req, res) => {
    try {
        if (!req.user)
            return;
        const { subject, question, images, diseaseDetectionId } = req.body;
        const consultation = await ExpertConsultation.create({
            farmerId: req.user._id,
            subject: subject || 'Crop Disease Consultation',
            question,
            images: images || [],
            diseaseDetectionId,
            status: 'OPEN',
        });
        res.status(201).json({
            success: true,
            message: 'Consultation request submitted! An agricultural specialist will reply shortly.',
            consultation,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const respondConsultation = async (req, res) => {
    try {
        if (!req.user)
            return;
        const { response } = req.body;
        const consultation = await ExpertConsultation.findById(req.params.id);
        if (!consultation) {
            res.status(404).json({ success: false, message: 'Consultation not found' });
            return;
        }
        consultation.expertId = req.user._id;
        consultation.response = response;
        consultation.status = 'ANSWERED';
        await consultation.save();
        res.status(200).json({ success: true, message: 'Response sent to farmer!', consultation });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getExpertsList = async (req, res) => {
    try {
        const experts = await User.find({ role: 'EXPERT' }).select('name email phone avatar rating');
        res.status(200).json({ success: true, experts });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
