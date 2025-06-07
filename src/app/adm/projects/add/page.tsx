"use client";

import AdmNavbar from "../../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../../components/adm/AuthWrapper";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi";

interface Client {
    _id: string;
    client_id: string;
    company_name: string;
    contact_name: string;
}

export default function AddProjectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [clients, setClients] = useState<Client[]>([]);
    const [formData, setFormData] = useState({
        client_id: "",
        project_name: "",
        project_description: "",
        status: "Not Started" as const
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchClients();
        
        // Pre-select client if client_id is provided in URL params
        const clientId = searchParams.get('client_id');
        if (clientId) {
            setFormData(prev => ({
                ...prev,
                client_id: clientId
            }));
        }
    }, [searchParams]);

    const fetchClients = async () => {
        try {
            const response = await fetch("/api/clients");
            if (!response.ok) throw new Error("Failed to fetch clients");
            const data = await response.json();
            setClients(data);
        } catch (err) {
            console.error("Failed to load clients:", err);
            setError("Failed to load clients for selection");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create project");
            }

            router.push("/adm/projects");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthWrapper>
            <div className="flex column">
                <AdmNavbar />
                <div id="main-content">
                    <div className="adm-form-header">
                        <Link href="/adm/projects" className="adm-back-button">
                            <HiOutlineArrowLeft />
                        </Link>
                        <h1 className="adm-title">Add New Project</h1>
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

                        <div className="adm-form-actions">
                            <Link href="/adm/projects" className="adm-button-secondary">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="adm-button-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creating..." : "Create Project"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthWrapper>
    );
} 