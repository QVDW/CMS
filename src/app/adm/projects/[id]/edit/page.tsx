"use client";

import AdmNavbar from "../../../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../../../components/adm/AuthWrapper";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi";

interface Client {
    _id: string;
    client_id: string;
    company_name: string;
    contact_name: string;
}

interface Project {
    _id: string;
    project_id: string;
    client_id: string;
    project_name: string;
    project_description: string;
    status: 'Not Started' | 'In Progress' | 'Confirmation Needed' | 'Completed';
    board_active: boolean;
    created_at: string;
    updated_at: string;
}

export default function EditProjectPage() {
    const params = useParams();
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [formData, setFormData] = useState({
        client_id: "",
        project_name: "",
        project_description: "",
        status: "Not Started" as 'Not Started' | 'In Progress' | 'Confirmation Needed' | 'Completed',
        board_active: true
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (params.id) {
            fetchProject();
            fetchClients();
        }
    }, [params.id]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${params.id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError("Project not found");
                    return;
                }
                throw new Error("Failed to fetch project");
            }
            const data = await response.json();
            const project: Project = data.project;
            setFormData({
                client_id: project.client_id,
                project_name: project.project_name,
                project_description: project.project_description,
                status: project.status,
                board_active: project.board_active ?? true  // Default to true if not set
            });
        } catch (err) {
            setError("Failed to load project");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await fetch("/api/clients");
            if (!response.ok) throw new Error("Failed to fetch clients");
            const data = await response.json();
            setClients(data);
        } catch (err) {
            console.error("Failed to load clients:", err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch(`/api/projects/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update project");
            }

            router.push(`/adm/projects/${params.id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <AuthWrapper>
                <div className="flex column">
                    <AdmNavbar />
                    <div id="main-content">
                        <div className="loading-state">Loading project...</div>
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    if (error && !formData.project_name) {
        return (
            <AuthWrapper>
                <div className="flex column">
                    <AdmNavbar />
                    <div id="main-content">
                        <div className="error-message">{error}</div>
                        <Link href="/adm/projects" className="adm-button-secondary">
                            Back to Projects
                        </Link>
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    return (
        <AuthWrapper>
            <div className="flex column">
                <AdmNavbar />
                <div id="main-content">
                    <div className="adm-form-header">
                        <Link href={`/adm/projects/${params.id}`} className="adm-back-button">
                            <HiOutlineArrowLeft />
                        </Link>
                        <h1 className="adm-title">Edit Project</h1>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form className="adm-form" onSubmit={handleSubmit}>
                        <div className="adm-form-group">
                            <label htmlFor="client_id">Client *</label>
                            <select
                                id="client_id"
                                name="client_id"
                                value={formData.client_id}
                                onChange={handleChange}
                                className="adm-form-control"
                                required
                            >
                                <option value="">Select a client...</option>
                                {clients.map((client) => (
                                    <option key={client._id} value={client.client_id}>
                                        {client.company_name} ({client.contact_name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="adm-form-group">
                            <label htmlFor="project_name">Project Name *</label>
                            <input
                                type="text"
                                id="project_name"
                                name="project_name"
                                value={formData.project_name}
                                onChange={handleChange}
                                className="adm-form-control"
                                placeholder="Enter project name"
                                required
                            />
                        </div>

                        <div className="adm-form-group">
                            <label htmlFor="project_description">Project Description</label>
                            <textarea
                                id="project_description"
                                name="project_description"
                                value={formData.project_description}
                                onChange={handleChange}
                                className="adm-form-control"
                                placeholder="Enter project description"
                                rows={4}
                            />
                        </div>

                        <div className="adm-form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="adm-form-control"
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Confirmation Needed">Confirmation Needed</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="adm-form-group">
                            <div className="adm-checkbox-group">
                                <input
                                    type="checkbox"
                                    id="board_active"
                                    name="board_active"
                                    checked={formData.board_active}
                                    onChange={handleChange}
                                    className="adm-checkbox"
                                />
                                <label htmlFor="board_active" className="adm-checkbox-label">
                                    <span className="checkbox-indicator"></span>
                                    <span className="checkbox-text">
                                        <strong>Active on Project Board</strong>
                                        <small>When enabled, this project will appear on the project board for drag-and-drop management.</small>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="adm-form-actions">
                            <Link href={`/adm/projects/${params.id}`} className="adm-button-secondary">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="adm-button-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Updating..." : "Update Project"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthWrapper>
    );
} 