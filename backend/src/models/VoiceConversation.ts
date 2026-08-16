import mongoose, { Schema, Document } from 'mongoose';

export interface IVoiceConversation extends Document {
  userId: mongoose.Types.ObjectId;
  transcription: string;
  detectedIntent: string;
  language: 'hi' | 'en' | 'hinglish';
  responseText: string;
  actionTaken?: string;
  createdAt: Date;
}

const VoiceConversationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    transcription: { type: String, required: true },
    detectedIntent: { type: String, required: true },
    language: { type: String, enum: ['hi', 'en', 'hinglish'], default: 'hi' },
    responseText: { type: String, required: true },
    actionTaken: { type: String },
  },
  { timestamps: true }
);

export const VoiceConversation = mongoose.model<IVoiceConversation>('VoiceConversation', VoiceConversationSchema);
