import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    project_id: {
        type: String,
        required: true,
        unique: true,
    },
    client_id: {
        type: String,
        required: true,
        ref: 'Client'
    },
    project_name: {
        type: String,
        required: true,
    },
    project_description: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
        enum: ['Not Started', 'In Progress', 'Confirmation Needed', 'Completed'],
        default: 'Not Started',
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

projectSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project; 