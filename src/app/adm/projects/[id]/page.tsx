"use client";

import AdmNavbar from "../../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../../components/adm/AuthWrapper";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlinePencil } from "react-icons/hi";
import { MdOutlineWork } from "react-icons/md";
import { FaCircle } from "react-icons/fa";

interface Project {
    _id: string;
    project_id: string;
    client_id: string;
    project_name: string;
    project_description: string;
    status: 'Not Started' | 'In Progress' | 'Confirmation Needed' | 'Completed';
    created_at: string;
    updated_at: string;
    client?: {
        client_id: string;
        company_name: string;
        contact_name: string;
        email?: string;
    };
}

export default function ViewProjectPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (params.id) {
            fetchProject();
        }
    }, [params.id]);

    const fetchProject = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/projects/${params.id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError("Project not found");
                    return;
                }
                throw new Error("Failed to fetch project");
            }
            const data = await response.json();
            setProject(data.project);
            setError("");
        } catch (err) {
            setError("Failed to load project");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusClass = (status: string) => {
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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    if (error) {
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

    if (!project) {
        return (
            <AuthWrapper>
                <div className="flex column">
                    <AdmNavbar />
                    <div id="main-content">
                        <div className="error-message">Project not found</div>
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
                        <Link href="/adm/projects" className="adm-back-button">
                            <HiOutlineArrowLeft />
                        </Link>
                        <h1 className="adm-title">
                            <MdOutlineWork style={{ marginRight: '8px' }} />
                            {project.project_name}
                        </h1>
                        <Link href={`/adm/projects/${project._id}/edit`} className="adm-button-primary">
                            <HiOutlinePencil />
                            Edit Project
                        </Link>
                    </div>

                    <div className="adm-view-container">
                        <div className="adm-view-section">
                            <h2>Project Information</h2>
                            <div className="adm-view-grid">
                                <div className="adm-view-field">
                                    <label>Project ID</label>
                                    <span>{project.project_id}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Project Name</label>
                                    <span>{project.project_name}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Status</label>
                                    <div className="status-indicator">
                                        <FaCircle className={`status-circle ${getStatusClass(project.status)}`} />
                                        <span className="status-text">{project.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="adm-view-section">
                            <h2>Client Information</h2>
                            <div className="adm-view-grid">
                                {project.client ? (
                                    <>
                                        <div className="adm-view-field">
                                            <label>Client ID</label>
                                            <span>{project.client.client_id}</span>
                                        </div>
                                        <div className="adm-view-field">
                                            <label>Company Name</label>
                                            <span>{project.client.company_name}</span>
                                        </div>
                                        <div className="adm-view-field">
                                            <label>Contact Name</label>
                                            <span>{project.client.contact_name}</span>
                                        </div>
                                        {project.client.email && (
                                            <div className="adm-view-field">
                                                <label>Email</label>
                                                <a href={`mailto:${project.client.email}`} className="adm-link">
                                                    {project.client.email}
                                                </a>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="adm-view-field">
                                        <label>Client</label>
                                        <span style={{ color: '#999' }}>Client not found</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {project.project_description && (
                            <div className="adm-view-section">
                                <h2>Project Description</h2>
                                <div className="adm-view-description">
                                    {project.project_description}
                                </div>
                            </div>
                        )}

                        <div className="adm-view-section">
                            <h2>Timeline</h2>
                            <div className="adm-view-grid">
                                <div className="adm-view-field">
                                    <label>Created</label>
                                    <span>{formatDate(project.created_at)}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Last Updated</label>
                                    <span>{formatDate(project.updated_at)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="adm-view-actions">
                            <Link href="/adm/projects" className="adm-button-secondary">
                                Back to Projects
                            </Link>
                            <Link href={`/adm/projects/${project._id}/edit`} className="adm-button-primary">
                                Edit Project
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
} 