"use client";

import AdmNavbar from "../../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../../components/adm/AuthWrapper";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HiOutlineOfficeBuilding, HiOutlinePencil, HiOutlineArrowLeft, HiOutlineEye, HiOutlinePlus } from "react-icons/hi";
import { FaCircle } from "react-icons/fa";
import { MdOutlineWork } from "react-icons/md";

interface Client {
    _id: string;
    client_id: string;
    company_name: string;
    contact_name: string;
    email: string;
    phone_number: string;
    address: string;
    industry: string;
    client_since: string;
    status: 'Active' | 'Inactive' | 'Prospect';
    created_at: string;
    updated_at: string;
}

interface Project {
    _id: string;
    project_id: string;
    project_name: string;
    project_description: string;
    status: 'Not Started' | 'In Progress' | 'Confirmation Needed' | 'Completed';
    created_at: string;
    updated_at: string;
}

export default function ViewClientPage() {
    const params = useParams();
    const [client, setClient] = useState<Client | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProjectsLoading, setIsProjectsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await fetch(`/api/clients/${params.id}`);
                if (!response.ok) throw new Error("Failed to fetch client");
                const data = await response.json();
                setClient(data.client);
            } catch (error) {
                console.error("Error fetching client:", error);
                setError("Error loading client data");
            } finally {
                setIsLoading(false);
            }
        };

        const fetchClientProjects = async () => {
            if (!client?.client_id) return;
            
            try {
                setIsProjectsLoading(true);
                const response = await fetch(`/api/projects?client_id=${client.client_id}`);
                if (!response.ok) throw new Error("Failed to fetch projects");
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching client projects:", error);
            } finally {
                setIsProjectsLoading(false);
            }
        };

        if (params.id) {
            fetchClient();
        }

        if (client) {
            fetchClientProjects();
        }
    }, [params.id, client?.client_id]);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Active': return 'active';
            case 'Inactive': return 'inactive';
            case 'Prospect': return 'prospect';
            default: return 'default';
        }
    };

    const getProjectStatusClass = (status: string) => {
        switch (status) {
            case 'Not Started': return 'not-started';
            case 'In Progress': return 'in-progress';
            case 'Confirmation Needed': return 'confirmation-needed';
            case 'Completed': return 'completed';
            default: return 'default';
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "Not set";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <AuthWrapper>
                <div className="flex column">
                    <AdmNavbar />
                    <div id="main-content">
                        <h1 className="adm-title">Client Details</h1>
                        <div className="loading-state">Loading client data...</div>
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    if (error || !client) {
        return (
            <AuthWrapper>
                <div className="flex column">
                    <AdmNavbar />
                    <div id="main-content">
                        <h1 className="adm-title">Client Details</h1>
                        <div className="error-message">{error || "Client not found"}</div>
                        <Link href="/adm/clients" className="adm-button">
                            <HiOutlineArrowLeft /> Back to Clients
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
                        <Link href="/adm/clients" className="adm-back-button">
                            <HiOutlineArrowLeft />
                        </Link>
                        <h1 className="adm-title">
                            <HiOutlineOfficeBuilding />
                            {client.company_name}
                        </h1>
                        <Link href={`/adm/clients/${client._id}/edit`} className="adm-button-primary">
                            <HiOutlinePencil />
                            Edit Client
                        </Link>
                    </div>

                    <div className="adm-view-container">
                        <div className="adm-view-section">
                            <h2>Basic Information</h2>
                            <div className="adm-view-grid">
                                <div className="adm-view-field">
                                    <label>Client ID</label>
                                    <span>{client.client_id}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Company Name</label>
                                    <span>{client.company_name}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Industry</label>
                                    <span>{client.industry || 'Not specified'}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Status</label>
                                    <div className="status-indicator">
                                        <FaCircle className={`status-circle ${getStatusClass(client.status)}`} />
                                        <span className="status-text">{client.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="adm-view-section">
                            <h2>Contact Information</h2>
                            <div className="adm-view-grid">
                                <div className="adm-view-field">
                                    <label>Contact Name</label>
                                    <span>{client.contact_name}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Email</label>
                                    <span>
                                        {client.email ? (
                                            <a href={`mailto:${client.email}`}>{client.email}</a>
                                        ) : (
                                            'Not provided'
                                        )}
                                    </span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Phone Number</label>
                                    <span>
                                        {client.phone_number ? (
                                            <a href={`tel:${client.phone_number}`}>{client.phone_number}</a>
                                        ) : (
                                            'Not provided'
                                        )}
                                    </span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Address</label>
                                    <span>{client.address || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="adm-view-section">
                            <h2>Timeline</h2>
                            <div className="adm-view-grid">
                                <div className="adm-view-field">
                                    <label>Client Since</label>
                                    <span>{formatDate(client.client_since)}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Created</label>
                                    <span>{formatDate(client.created_at)}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Last Updated</label>
                                    <span>{formatDate(client.updated_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="related-section">
                        <div className="section-header">
                            <h3>
                                <MdOutlineWork /> 
                                Projects ({projects.length})
                            </h3>
                            <div className="section-actions">
                                <Link 
                                    href={`/adm/projects/add?client_id=${client.client_id}`} 
                                    className="adm-button-primary"
                                >
                                    <HiOutlinePlus /> Add Project
                                </Link>
                            </div>
                        </div>

                        {isProjectsLoading ? (
                            <div className="loading-state">Loading projects...</div>
                        ) : projects.length > 0 ? (
                            <div className="adm-items">
                                {projects.map((project) => (
                                    <div className="adm-item" key={project._id} style={{ marginBottom: '1rem' }}>
                                        <div className="adm-item-left">
                                            <MdOutlineWork className="adm-item-icon"/>
                                            <h2 className="adm-item-name">{project.project_name}</h2>
                                        </div>
                                        <div className="adm-item-details">
                                            <div className="adm-item-release-date">
                                                <span>Project ID: </span>
                                                <strong>{project.project_id}</strong>
                                                {project.project_description && (
                                                    <span> - {project.project_description.substring(0, 100)}{project.project_description.length > 100 ? '...' : ''}</span>
                                                )}
                                            </div>
                                            <div className="adm-item-status">
                                                <div>
                                                    <div className="status-indicator">
                                                        <span className="status-label">Status:</span>
                                                        <FaCircle className={`status-circle ${getProjectStatusClass(project.status)}`} />
                                                        <span className="status-text">{project.status}</span>
                                                    </div>
                                                    <div className="status-indicator">
                                                        <span className="status-label">Created:</span>
                                                        <span className="status-text">{formatDate(project.created_at)}</span>
                                                    </div>
                                                </div>
                                                <div className="adm-item-actions">
                                                    <Link href={`/adm/projects/${project._id}`} title="View Project">
                                                        <HiOutlineEye />
                                                    </Link>
                                                    <Link href={`/adm/projects/${project._id}/edit`} title="Edit Project">
                                                        <HiOutlinePencil />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-items">
                                <p>No projects found for this client.</p>
                                <Link 
                                    href={`/adm/projects/add?client_id=${client.client_id}`} 
                                    className="adm-button-primary"
                                >
                                    <HiOutlinePlus /> Create First Project
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="adm-form-actions">
                        <Link href="/adm/clients" className="adm-button-secondary">
                            <HiOutlineArrowLeft /> Back to Clients
                        </Link>
                        <Link href={`/adm/projects?client_id=${client.client_id}`} className="adm-button-primary">
                            <MdOutlineWork /> View All Projects
                        </Link>
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
} 