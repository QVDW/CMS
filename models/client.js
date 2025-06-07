import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    client_id: {
        type: String,
        required: true,
        unique: true,
    },
    company_name: {
        type: String,
        required: true,
    },
    contact_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Invalid email format"
        }
    },
    phone_number: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    industry: {
        type: String,
        required: false,
    },
    client_since: {
        type: Date,
        required: false,
        default: Date.now,
    },
    status: {
        type: String,
        required: false,
        enum: ['Active', 'Inactive', 'Prospect'],
        default: 'Prospect',
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

clientSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);

export default Client; 