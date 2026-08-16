import mongoose, { Schema } from 'mongoose';
const VoiceConversationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    transcription: { type: String, required: true },
    detectedIntent: { type: String, required: true },
    language: { type: String, enum: ['hi', 'en', 'hinglish'], default: 'hi' },
    responseText: { type: String, required: true },
    actionTaken: { type: String },
}, { timestamps: true });
export const VoiceConversation = mongoose.model('VoiceConversation', VoiceConversationSchema);
