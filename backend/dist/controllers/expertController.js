import { ExpertConsultation } from '../models/ExpertConsultation.js';
import { User } from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
export const fallbackExperts = [
    {
        _id: 'exp-1',
        id: 'exp-1',
        name: 'Dr. Anita Verma',
        specialization: 'Senior Agronomist (KVK Lucknow)',
        email: 'anita.verma@kvk.org.in',
        phone: '+91 98765 00002',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        experience: '14+ Years',
    },
    {
        _id: 'exp-2',
        id: 'exp-2',
        name: 'Prof. Rajesh Kumar',
        specialization: 'Plant Pathologist & Disease Specialist',
        email: 'rajesh.pathology@nau.edu.in',
        phone: '+91 98765 00003',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        experience: '18+ Years',
    },
    {
        _id: 'exp-3',
        id: 'exp-3',
        name: 'Dr. Suresh Patel',
        specialization: 'Soil Health & Fertilizer Scientist (ICAR)',
        email: 'suresh.soil@icar.gov.in',
        phone: '+91 98765 00004',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        experience: '12+ Years',
    },
];
export const inMemoryConsultations = [];
export const getConsultations = async (req, res) => {
    try {
        if (!req.user)
            return;
        let consultations = [];
        if (isMongoConnected()) {
            try {
                let filter = {};
                if (req.user.role === 'FARMER') {
                    filter = { farmerId: req.user._id };
                }
                else if (req.user.role === 'EXPERT') {
                    filter = { $or: [{ expertId: req.user._id }, { status: 'OPEN' }] };
                }
                consultations = await ExpertConsultation.find(filter)
                    .populate('farmerId', 'name phone avatar')
                    .populate('expertId', 'name email avatar')
                    .populate('diseaseDetectionId')
                    .sort({ createdAt: -1 });
            }
            catch (dbErr) {
                console.warn('[MongoDB Consultations Warning]:', dbErr);
            }
        }
        if (!consultations || consultations.length === 0) {
            consultations = inMemoryConsultations.filter((c) => !req.user ||
                req.user.role === 'ADMIN' ||
                req.user.role === 'EXPERT' ||
                c.farmerId === req.user._id ||
                c.farmerId === req.user.id);
        }
        res.status(200).json({ success: true, consultations });
    }
    catch (error) {
        res.status(200).json({ success: true, consultations: inMemoryConsultations });
    }
};
export const createConsultation = async (req, res) => {
    try {
        if (!req.user)
            return;
        const { subject, question, images, diseaseDetectionId } = req.body;
        let consultation = null;
        if (isMongoConnected()) {
            try {
                consultation = await ExpertConsultation.create({
                    farmerId: req.user._id,
                    subject: subject || 'Crop Disease Consultation',
                    question,
                    images: images || [],
                    diseaseDetectionId,
                    status: 'OPEN',
                });
            }
            catch (dbErr) {
                console.warn('[MongoDB Create Consultation Fallback]:', dbErr);
            }
        }
        if (!consultation) {
            consultation = {
                _id: 'cons-' + Date.now(),
                id: 'cons-' + Date.now(),
                farmerId: req.user._id || req.user.id,
                subject: subject || 'Crop Disease Consultation',
                question,
                images: images || [],
                diseaseDetectionId,
                status: 'OPEN',
                createdAt: new Date(),
            };
            inMemoryConsultations.unshift(consultation);
        }
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
        let consultation = null;
        if (isMongoConnected()) {
            try {
                consultation = await ExpertConsultation.findById(req.params.id);
                if (consultation) {
                    consultation.expertId = req.user._id;
                    consultation.response = response;
                    consultation.status = 'ANSWERED';
                    await consultation.save();
                }
            }
            catch (dbErr) {
                console.warn('[MongoDB Respond Consultation Fallback]:', dbErr);
            }
        }
        if (!consultation) {
            const idx = inMemoryConsultations.findIndex((c) => c._id === req.params.id || c.id === req.params.id);
            if (idx > -1) {
                inMemoryConsultations[idx].expertId = req.user._id || req.user.id;
                inMemoryConsultations[idx].response = response;
                inMemoryConsultations[idx].status = 'ANSWERED';
                consultation = inMemoryConsultations[idx];
            }
        }
        if (!consultation) {
            res.status(404).json({ success: false, message: 'Consultation not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Response sent to farmer!', consultation });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getExpertsList = async (req, res) => {
    try {
        let experts = [];
        if (isMongoConnected()) {
            try {
                experts = await User.find({ role: 'EXPERT' }).select('name email phone avatar rating');
            }
            catch (dbErr) {
                console.warn('[MongoDB Experts Query Fallback]:', dbErr);
            }
        }
        if (!experts || experts.length === 0) {
            experts = fallbackExperts;
        }
        res.status(200).json({ success: true, experts });
    }
    catch (error) {
        res.status(200).json({ success: true, experts: fallbackExperts });
    }
};
