import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    refreshTokenHash: string;
    device: string;
    ipAddress: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        refreshTokenHash: {
            type: String,
            required: true,
        },
        device: {
            type: String,
            default: 'Unknown Device',
        },
        ipAddress: {
            type: String,
            default: 'Unknown IP',
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Session || 
    mongoose.model<ISession>('Session', SessionSchema);
