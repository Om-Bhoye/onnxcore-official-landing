import mongoose, { Schema, Document } from 'mongoose';
import { USER_ROLES, UserRole } from './User';

export type RoleRequestStatus = 'pending' | 'approved' | 'rejected';

export interface IRoleRequest extends Document {
    userId: mongoose.Types.ObjectId;
    requestedRole: UserRole;
    status: RoleRequestStatus;
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    reason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const RoleRequestSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        requestedRole: {
            type: String,
            enum: USER_ROLES,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        reviewedAt: {
            type: Date,
            default: null,
        },
        reason: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

export default mongoose.models.RoleRequest ||
    mongoose.model<IRoleRequest>('RoleRequest', RoleRequestSchema);
