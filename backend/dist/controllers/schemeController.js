import { GovernmentScheme } from '../models/GovernmentScheme.js';
export const getSchemes = async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const schemes = await GovernmentScheme.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, schemes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
