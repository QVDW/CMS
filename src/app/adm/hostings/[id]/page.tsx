"use client";

import AdmNavbar from "../../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../../components/adm/AuthWrapper";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlinePencil } from "react-icons/hi";
import { HiOutlineServer } from "react-icons/hi";
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
        email?: string;
    };
}

export default function ViewHostingPage() {
    const params = useParams();
    const router = useRouter();
    const [hosting, setHosting] = useState<Hosting | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (params.id) {
            fetchHosting();
        }
    }, [params.id]);

    const fetchHosting = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/hostings/${params.id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError("Hosting not found");
                    return;
                }
                throw new Error("Failed to fetch hosting");
            }
            const data = await response.json();
            setHosting(data.hosting);
            setError("");
        } catch (err) {
            setError("Failed to load hosting");
            console.error(err);
        } finally {
            setIsLoading(false);
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
                        <div className="loading-state">Loading hosting...</div>
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
                        <Link href="/adm/hostings" className="adm-button-secondary">
                            Back to Hostings
                        </Link>
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    if (!hosting) {
        return (
            <AuthWrapper>
                <div className="flex column">
                    <AdmNavbar />
                    <div id="main-content">
                        <div className="error-message">Hosting not found</div>
                        <Link href="/adm/hostings" className="adm-button-secondary">
                            Back to Hostings
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
                        <Link href="/adm/hostings" className="adm-back-button">
                            <HiOutlineArrowLeft />
                        </Link>
                        <h1 className="adm-title">
                            <HiOutlineServer style={{ marginRight: '8px' }} />
                            {hosting.domain_name}
                        </h1>
                        <Link href={`/adm/hostings/${hosting._id}/edit`} className="adm-button-primary">
                            <HiOutlinePencil />
                            Edit Hosting
                        </Link>
                    </div>

                    <div className="adm-view-container">
                        <div className="adm-view-section">
                            <h2>Hosting Information</h2>
                            <div className="adm-view-grid">
                                <div className="adm-view-field">
                                    <label>Hosting ID</label>
                                    <span>{hosting.hosting_id}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Domain Name</label>
                                    <span>{hosting.domain_name}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Host Provider</label>
                                    <span>{hosting.host_provider}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Status</label>
                                    <div className="status-indicator">
                                        <FaCircle className={`status-circle ${getStatusClass(hosting.status)}`} />
                                        <span className="status-text">{hosting.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="adm-view-section">
                            <h2>Account Information</h2>
                            <div className="adm-view-grid">
                                {hosting.username && (
                                    <div className="adm-view-field">
                                        <label>Username</label>
                                        <span>{hosting.username}</span>
                                    </div>
                                )}
                                {hosting.email && (
                                    <div className="adm-view-field">
                                        <label>Email</label>
                                        <a href={`mailto:${hosting.email}`} className="adm-link">
                                            {hosting.email}
                                        </a>
                                    </div>
                                )}
                                {hosting.username && (
                                    <div className="adm-view-field">
                                        <label>Password</label>
                                        <span className="password-hidden">••••••••</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {hosting.putty_connection && (hosting.putty_connection.hostname || hosting.putty_connection.username) && (
                            <div className="adm-view-section">
                                <h2>SSH/PuTTY Connection</h2>
                                <div className="adm-view-grid">
                                    {hosting.putty_connection.hostname && (
                                        <div className="adm-view-field">
                                            <label>Hostname/IP</label>
                                            <span className="monospace">{hosting.putty_connection.hostname}</span>
                                        </div>
                                    )}
                                    <div className="adm-view-field">
                                        <label>Port</label>
                                        <span className="monospace">{hosting.putty_connection.port || 22}</span>
                                    </div>
                                    {hosting.putty_connection.username && (
                                        <div className="adm-view-field">
                                            <label>SSH Username</label>
                                            <span className="monospace">{hosting.putty_connection.username}</span>
                                        </div>
                                    )}
                                    <div className="adm-view-field">
                                        <label>Connection Type</label>
                                        <span>{hosting.putty_connection.connection_type || 'SSH'}</span>
                                    </div>
                                    {hosting.putty_connection.username && (
                                        <div className="adm-view-field">
                                            <label>SSH Password</label>
                                            <span className="password-hidden">••••••••</span>
                                        </div>
                                    )}
                                    {hosting.putty_connection.hostname && hosting.putty_connection.username && (
                                        <div className="adm-view-field">
                                            <label>Connection String</label>
                                            <span className="monospace connection-string">
                                                {(hosting.putty_connection.connection_type || 'ssh').toLowerCase()} {hosting.putty_connection.username}@{hosting.putty_connection.hostname} -p {hosting.putty_connection.port || 22}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="adm-view-section">
                            <h2>Client Information</h2>
                            <div className="adm-view-grid">
                                {hosting.client ? (
                                    <>
                                        <div className="adm-view-field">
                                            <label>Client ID</label>
                                            <span>{hosting.client.client_id}</span>
                                        </div>
                                        <div className="adm-view-field">
                                            <label>Company Name</label>
                                            <Link href={`/adm/clients/${hosting.client.client_id}`} className="adm-link">
                                                {hosting.client.company_name}
                                            </Link>
                                        </div>
                                        <div className="adm-view-field">
                                            <label>Contact Name</label>
                                            <span>{hosting.client.contact_name}</span>
                                        </div>
                                        {hosting.client.email && (
                                            <div className="adm-view-field">
                                                <label>Client Email</label>
                                                <a href={`mailto:${hosting.client.email}`} className="adm-link">
                                                    {hosting.client.email}
                                                </a>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="adm-view-field">
                                        <label>Client</label>
                                        <span style={{ color: '#999' }}>Unknown Client</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="adm-view-section">
                            <h2>Timestamps</h2>
                            <div className="adm-view-grid">
                                <div className="adm-view-field">
                                    <label>Created</label>
                                    <span>{formatDate(hosting.created_at)}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Last Updated</label>
                                    <span>{formatDate(hosting.updated_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="adm-form-actions">
                        <Link href="/adm/hostings" className="adm-button-secondary">
                            Back to Hostings
                        </Link>
                        <Link href={`/adm/hostings/${hosting._id}/edit`} className="adm-button-primary">
                            <HiOutlinePencil />
                            Edit Hosting
                        </Link>
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
} 