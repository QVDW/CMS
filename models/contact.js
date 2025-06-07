import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    contact_id: {
        type: String,
        required: true,
        unique: true,
    },
    client_id: {
        type: String,
        required: true,
        ref: 'Client'
    },
    name: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    notes: {
        type: String,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

contactSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact; 