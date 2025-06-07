import mongoose from "mongoose";
import bcrypt from "bcrypt";

const hostingSchema = new mongoose.Schema({
    hosting_id: {
        type: String,
        required: true,
        unique: true,
    },
    client_id: {
        type: String,
        required: true,
        ref: 'Client'
    },
    host_provider: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: false,
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
    password: {
        type: String,
        required: false,
    },
    domain_name: {
        type: String,
        required: false,
    },
    putty_connection: {
        type: {
            hostname: {
                type: String,
                required: false,
            },
            port: {
                type: Number,
                required: false,
                default: 22,
            },
            username: {
                type: String,
                required: false,
            },
            password: {
                type: String,
                required: false,
            },
            connection_type: {
                type: String,
                enum: ['SSH', 'Telnet', 'Raw', 'Rlogin', 'Serial'],
                default: 'SSH',
            }
        },
        required: false,
    },
    status: {
        type: String,
        required: false,
        enum: ['Active', 'Inactive', 'Suspended', 'Expired'],
        default: 'Active',
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

// Hash both the main password and PuTTY password before saving
hostingSchema.pre('save', async function(next) {
    try {
        // Hash main password if it exists and is modified or new
        if (this.password && (this.isModified('password') || this.isNew)) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        
        // Hash PuTTY password if it exists and is modified or new
        if (this.putty_connection && this.putty_connection.password && (this.isModified('putty_connection.password') || this.isNew)) {
            const salt = await bcrypt.genSalt(10);
            this.putty_connection.password = await bcrypt.hash(this.putty_connection.password, salt);
        }
        
        // Update timestamp
        this.updated_at = Date.now();
        next();
    } catch (error) {
        return next(error);
    }
});

// Clear the cached model to ensure we use the updated schema
if (mongoose.models.Hosting) {
    delete mongoose.models.Hosting;
}

const Hosting = mongoose.model("Hosting", hostingSchema);

export default Hosting; 