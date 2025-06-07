"use client";

import AdmNavbar from "../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../components/adm/AuthWrapper";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HiOutlineServer } from "react-icons/hi";
import { 
    HiOutlinePlus, 
    HiOutlineSearch,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineEye
} from "react-icons/hi";
import { FaCircle } from "react-icons/fa";

interface Hosting {
    _id: string;
    hosting_id: string;
    client_id: string;
    host_provider: string;
    username: string;
    email: string;
    domain_name: string;
    putty_connection: {
        hostname: string;
        port: number;
        username: string;
        connection_type: string;
    };
    status: 'Active' | 'Inactive' | 'Suspended' | 'Expired';
    created_at: string;
    updated_at: string;
    client?: {
        client_id: string;
        company_name: string;
        contact_name: string;
    };
}

export default function HostingsPage() {
    const [hostings, setHostings] = useState<Hosting[]>([]);
    const [filteredHostings, setFilteredHostings] = useState<Hosting[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHostings();
    }, []);

    useEffect(() => {
        filterHostings();
    }, [hostings, searchTerm]);

    const fetchHostings = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/hostings");
            if (!response.ok) throw new Error("Failed to fetch hostings");
            const data = await response.json();
            setHostings(data);
            setError("");
        } catch (err) {
            setError("Failed to load hostings");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filterHostings = () => {
        if (!searchTerm.trim()) {
            setFilteredHostings(hostings);
            return;
        }

        const query = searchTerm.toLowerCase().trim();
        const filtered = hostings.filter(hosting =>
            hosting.domain_name.toLowerCase().includes(query) ||
            hosting.hosting_id.toLowerCase().includes(query) ||
            hosting.host_provider.toLowerCase().includes(query) ||
            hosting.username.toLowerCase().includes(query) ||
            hosting.email.toLowerCase().includes(query) ||
            (hosting.client?.company_name && hosting.client.company_name.toLowerCase().includes(query)) ||
            hosting.status.toLowerCase().includes(query) ||
            hosting.putty_connection.hostname.toLowerCase().includes(query)
        );

        setFilteredHostings(filtered);
    };

    const deleteHosting = async (id: string, domainName: string) => {
        if (!confirm(`Are you sure you want to delete hosting for "${domainName}"?`)) return;

        try {
            const response = await fetch(`/api/hostings?id=${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete hosting");
            await fetchHostings();
        } catch (err) {
            alert("Failed to delete hosting");
            console.error(err);
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Active': return 'completed';
            case 'Inactive': return 'not-started';
            case 'Suspended': return 'confirmation-needed';
            case 'Expired': return 'not-started';
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
                    <h1 className="adm-title">Hostings</h1>
                    <form id="adm-search" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Search hostings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="adm-search-button adm-button">
                            <HiOutlineSearch />
                        </button>
                        <Link href="/adm/hostings/add" className="adm-button adm-add">
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
                            <div className="loading-state">Loading hostings...</div>
                        ) : filteredHostings.length > 0 ? (
                            filteredHostings.map((hosting) => (
                                <div className="adm-item" key={hosting._id}>
                                    <div className="adm-item-left">
                                        <HiOutlineServer className="adm-item-icon"/>
                                        <h2 className="adm-item-name">{hosting.domain_name}</h2>
                                    </div>
                                    <div className="adm-item-details">
                                        <div className="adm-item-release-date">
                                            <span>Client: </span>
                                            {hosting.client ? (
                                                <strong>{hosting.client.company_name}</strong>
                                            ) : (
                                                <span style={{ color: '#999' }}>Unknown Client</span>
                                            )}
                                            <span> - {hosting.host_provider}</span>
                                            {hosting.username && <span> ({hosting.username})</span>}
                                        </div>
                                        <div className="adm-item-status">
                                            <div>
                                                <div className="status-indicator">
                                                    <span className="status-label">Status:</span>
                                                    <FaCircle className={`status-circle ${getStatusClass(hosting.status)}`} />
                                                    <span className="status-text">{hosting.status}</span>
                                                </div>
                                                <div className="status-indicator">
                                                    <span className="status-label">Hosting ID:</span>
                                                    <span className="status-text">{hosting.hosting_id}</span>
                                                </div>
                                                {hosting.putty_connection?.hostname && (
                                                    <div className="status-indicator">
                                                        <span className="status-label">SSH:</span>
                                                        <span className="status-text">{hosting.putty_connection.hostname}:{hosting.putty_connection.port || 22}</span>
                                                    </div>
                                                )}
                                                <div className="status-indicator">
                                                    <span className="status-label">Created:</span>
                                                    <span className="status-text">{formatDate(hosting.created_at)}</span>
                                                </div>
                                            </div>
                                            <div className="adm-item-actions">
                                                <Link href={`/adm/hostings/${hosting._id}`} title="View Details">
                                                    <HiOutlineEye />
                                                </Link>
                                                <Link href={`/adm/hostings/${hosting._id}/edit`} title="Edit Hosting">
                                                    <HiOutlinePencil />
                                                </Link>
                                                <button
                                                    onClick={() => deleteHosting(hosting._id, hosting.domain_name)}
                                                    title="Delete Hosting"
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
                                <HiOutlineServer className="no-items-icon" />
                                <h3>No hostings found</h3>
                                <p>
                                    {searchTerm ? "No hostings match your search." : "Get started by adding your first hosting."}
                                </p>
                                <Link href="/adm/hostings/add" className="adm-button adm-add">
                                    <HiOutlinePlus />
                                    Add First Hosting
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
} 