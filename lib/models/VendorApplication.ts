import mongoose, { Schema, Document } from 'mongoose';

export type VendorApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface IVendorApplication extends Document {
    companyName: string;
    companyBrandName: string;
    officialWebsite: string;
    companyAddress: string;
    contactPerson: string;
    email: string;
    businessType?: string;
    status: VendorApplicationStatus;
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const VendorApplicationSchema: Schema = new Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true,
        },
        companyBrandName: {
            type: String,
            required: true,
            trim: true,
        },
        officialWebsite: {
            type: String,
            required: true,
            trim: true,
        },
        companyAddress: {
            type: String,
            required: true,
            trim: true,
        },
        contactPerson: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        businessType: {
            type: String,
            default: '',
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
    },
    { timestamps: true }
);

export default mongoose.models.VendorApplication || 
    mongoose.model<IVendorApplication>('VendorApplication', VendorApplicationSchema);
