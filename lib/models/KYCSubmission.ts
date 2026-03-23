import mongoose, { Schema, Document } from 'mongoose';

export type KYCSubmissionStatus = 'pending' | 'approved' | 'rejected';
export type KYCType = 'individual' | 'corporate';

export interface IDocumentRef {
    label: string;
    url: string;
    storagePath: string;
    mimeType: string;
    sizeBytes: number;
    uploadedAt: Date;
}

export interface IKYCSubmission extends Document {
    userId: mongoose.Types.ObjectId;
    kycType: KYCType;
    phoneNumber: string;
    phoneVerifiedAt: Date;
    status: KYCSubmissionStatus;
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    rejectionReason?: string;
    submittedAt: Date;
    individualDetails?: {
        firstName: string;
        lastName: string;
        contactNumber: string;
        idNumber: string;
        idFrontUrl: string;
        idBackUrl: string;
        facialVideoUrl: string;
    };
    corporateDetails?: {
        companyName: string;
        contactNumber: string;
        taxIdNumber: string;
        gstCertificateUrl?: string;
        tradeLicenseUrl?: string;
        panCardUrl?: string;
        facialVideoUrl: string;
    };
    documents: IDocumentRef[];
    createdAt: Date;
    updatedAt: Date;
}

const DocumentRefSchema = new Schema({
    label: { type: String, required: true },
    url: { type: String, required: true },
    storagePath: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
});

const KYCSubmissionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },
        kycType: {
            type: String,
            enum: ['individual', 'corporate'],
            required: true,
            index: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        phoneVerifiedAt: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
            index: true,
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
        rejectionReason: {
            type: String,
            default: '',
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        individualDetails: {
            firstName: String,
            lastName: String,
            contactNumber: String,
            idNumber: String,
            idFrontUrl: String,
            idBackUrl: String,
            facialVideoUrl: String,
        },
        corporateDetails: {
            companyName: String,
            contactNumber: String,
            taxIdNumber: String,
            gstCertificateUrl: String,
            tradeLicenseUrl: String,
            panCardUrl: String,
            facialVideoUrl: String,
        },
        documents: [DocumentRefSchema],
    },
    { timestamps: true }
);

export default mongoose.models.KYCSubmission || 
    mongoose.model<IKYCSubmission>('KYCSubmission', KYCSubmissionSchema);
