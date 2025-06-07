"use client";

import AdmNavbar from "../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../components/adm/AuthWrapper";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MdOutlineWork } from "react-icons/md";
import { 
    HiOutlinePlus, 
    HiOutlineSearch,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineEye
} from "react-icons/hi";
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
    };
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        filterProjects();
    }, [projects, searchTerm]);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/projects");
            if (!response.ok) throw new Error("Failed to fetch projects");
            const data = await response.json();
            setProjects(data);
            setError("");
        } catch (err) {
            setError("Failed to load projects");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filterProjects = () => {
        if (!searchTerm.trim()) {
            setFilteredProjects(projects);
            return;
        }

        const query = searchTerm.toLowerCase().trim();
        const filtered = projects.filter(project =>
            project.project_name.toLowerCase().includes(query) ||
            project.project_id.toLowerCase().includes(query) ||
            project.project_description.toLowerCase().includes(query) ||
            (project.client?.company_name && project.client.company_name.toLowerCase().includes(query)) ||
            project.status.toLowerCase().includes(query)
        );

        setFilteredProjects(filtered);
    };

    const deleteProject = async (id: string, projectName: string) => {
        if (!confirm(`Are you sure you want to delete "${projectName}"?`)) return;

        try {
            const response = await fetch(`/api/projects?id=${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete project");
            await fetchProjects();
        } catch (err) {
            alert("Failed to delete project");
            console.error(err);
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
            month: 'short',
            day: 'numeric'
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <AuthWrapper>
            <div className="flex column">
                <AdmNavbar />
                <div id="main-content">
                    <h1 className="adm-title">Projects</h1>
                    <form id="adm-search" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="adm-search-button adm-button">
                            <HiOutlineSearch />
                        </button>
                        <Link href="/adm/projects/add" className="adm-button adm-add">
                            <HiOutlinePlus />
                        </Link>
                    </form>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="adm-items">
                        {isLoading ? (
                            <div className="loading-state">Loading projects...</div>
                        ) : filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <div className="adm-item" key={project._id}>
                                    <div className="adm-item-left">
                                        <MdOutlineWork className="adm-item-icon"/>
                                        <h2 className="adm-item-name">{project.project_name}</h2>
                                    </div>
                                    <div className="adm-item-details">
                                        <div className="adm-item-release-date">
                                            <span>Client: </span>
                                            {project.client ? (
                                                <strong>{project.client.company_name}</strong>
                                            ) : (
                                                <span style={{ color: '#999' }}>Unknown Client</span>
                                            )}
                                            {project.project_description && (
                                                <span> - {project.project_description.substring(0, 100)}{project.project_description.length > 100 ? '...' : ''}</span>
                                            )}
                                        </div>
                                        <div className="adm-item-status">
                                            <div>
                                                <div className="status-indicator">
                                                    <span className="status-label">Status:</span>
                                                    <FaCircle className={`status-circle ${getStatusClass(project.status)}`} />
                                                    <span className="status-text">{project.status}</span>
                                                </div>
                                                <div className="status-indicator">
                                                    <span className="status-label">Project ID:</span>
                                                    <span className="status-text">{project.project_id}</span>
                                                </div>
                                                <div className="status-indicator">
                                                    <span className="status-label">Created:</span>
                                                    <span className="status-text">{formatDate(project.created_at)}</span>
                                                </div>
                                            </div>
                                            <div className="adm-item-actions">
                                                <Link href={`/adm/projects/${project._id}`} title="View Details">
                                                    <HiOutlineEye />
                                                </Link>
                                                <Link href={`/adm/projects/${project._id}/edit`} title="Edit Project">
                                                    <HiOutlinePencil />
                                                </Link>
                                                <button
                                                    onClick={() => deleteProject(project._id, project.project_name)}
                                                    title="Delete Project"
                                                    className="delete-btn"
                                                >
                                                    <HiOutlineTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-items">
                                {searchTerm ? (
                                    <p>No projects match your search.</p>
                                ) : (
                                    <p>No projects found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
} 