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
}

export default function EditHostingPage() {
    const params = useParams();
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [formData, setFormData] = useState({
        client_id: "",
        host_provider: "",
        username: "",
        email: "",
        password: "",
        domain_name: "",
        putty_connection: {
            hostname: "",
            port: 22,
            username: "",
            password: "",
            connection_type: "SSH" as 'SSH' | 'Telnet' | 'Raw' | 'Rlogin' | 'Serial'
        },
        status: "Active" as 'Active' | 'Inactive' | 'Suspended' | 'Expired'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (params.id) {
            fetchHosting();
            fetchClients();
        }
    }, [params.id]);

    const fetchHosting = async () => {
        try {
            const response = await fetch(`/api/hostings/${params.id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError("Hosting not found");
                    return;
                }
                throw new Error("Failed to fetch hosting");
            }
            const data = await response.json();
            const hosting: Hosting = data.hosting;
            setFormData({
                client_id: hosting.client_id,
                host_provider: hosting.host_provider,
                username: hosting.username,
                email: hosting.email,
                password: "", // Don't populate password for security
                domain_name: hosting.domain_name,
                putty_connection: {
                    hostname: hosting.putty_connection.hostname,
                    port: hosting.putty_connection.port,
                    username: hosting.putty_connection.username,
                    password: "", // Don't populate password for security
                    connection_type: hosting.putty_connection.connection_type as 'SSH' | 'Telnet' | 'Raw' | 'Rlogin' | 'Serial'
                },
                status: hosting.status
            });
        } catch (err) {
            setError("Failed to load hosting");
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
        const { name, value } = e.target;
        
        if (name.startsWith('putty_')) {
            const puttyField = name.replace('putty_', '');
            setFormData(prev => ({
                ...prev,
                putty_connection: {
                    ...prev.putty_connection,
                    [puttyField]: puttyField === 'port' ? parseInt(value) || 22 : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch(`/api/hostings/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update hosting");
            }

            router.push(`/adm/hostings/${params.id}`);
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
                        <div className="loading-state">Loading hosting...</div>
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    if (error && !formData.domain_name) {
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

    return (
        <AuthWrapper>
            <div className="flex column">
                <AdmNavbar />
                <div id="main-content">
                    <div className="adm-form-header">
                        <Link href={`/adm/hostings/${params.id}`} className="adm-back-button">
                            <HiOutlineArrowLeft />
                        </Link>
                        <h1 className="adm-title">Edit Hosting</h1>
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

                        <div className="adm-form-row">
                            <div className="adm-form-group">
                                <label htmlFor="host_provider">Host Provider *</label>
                                <input
                                    type="text"
                                    id="host_provider"
                                    name="host_provider"
                                    value={formData.host_provider}
                                    onChange={handleChange}
                                    className="adm-form-control"
                                    placeholder="e.g., DigitalOcean, AWS, Hostinger"
                                    required
                                />
                            </div>

                            <div className="adm-form-group">
                                <label htmlFor="domain_name">Domain Name</label>
                                <input
                                    type="text"
                                    id="domain_name"
                                    name="domain_name"
                                    value={formData.domain_name}
                                    onChange={handleChange}
                                    className="adm-form-control"
                                    placeholder="example.com"
                                />
                            </div>
                        </div>

                        <div className="adm-form-row">
                            <div className="adm-form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="adm-form-control"
                                    placeholder="Hosting account username"
                                />
                            </div>

                            <div className="adm-form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="adm-form-control"
                                    placeholder="hosting@example.com"
                                />
                            </div>
                        </div>

                        <div className="adm-form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="adm-form-control"
                                placeholder="Leave empty to keep current password"
                            />
                            <small className="form-help">Leave empty to keep the current password</small>
                        </div>

                        <div className="adm-form-section">
                            <h3>PuTTY/SSH Connection Details</h3>
                            
                            <div className="adm-form-row">
                                <div className="adm-form-group">
                                    <label htmlFor="putty_hostname">Hostname/IP Address</label>
                                    <input
                                        type="text"
                                        id="putty_hostname"
                                        name="putty_hostname"
                                        value={formData.putty_connection.hostname}
                                        onChange={handleChange}
                                        className="adm-form-control"
                                        placeholder="192.168.1.100 or server.example.com"
                                    />
                                </div>

                                <div className="adm-form-group">
                                    <label htmlFor="putty_port">Port</label>
                                    <input
                                        type="number"
                                        id="putty_port"
                                        name="putty_port"
                                        value={formData.putty_connection.port}
                                        onChange={handleChange}
                                        className="adm-form-control"
                                        placeholder="22"
                                        min="1"
                                        max="65535"
                                    />
                                </div>
                            </div>

                            <div className="adm-form-row">
                                <div className="adm-form-group">
                                    <label htmlFor="putty_username">SSH Username</label>
                                    <input
                                        type="text"
                                        id="putty_username"
                                        name="putty_username"
                                        value={formData.putty_connection.username}
                                        onChange={handleChange}
                                        className="adm-form-control"
                                        placeholder="root or ubuntu"
                                    />
                                </div>

                                <div className="adm-form-group">
                                    <label htmlFor="putty_connection_type">Connection Type</label>
                                    <select
                                        id="putty_connection_type"
                                        name="putty_connection_type"
                                        value={formData.putty_connection.connection_type}
                                        onChange={handleChange}
                                        className="adm-form-control"
                                    >
                                        <option value="SSH">SSH</option>
                                        <option value="Telnet">Telnet</option>
                                        <option value="Raw">Raw</option>
                                        <option value="Rlogin">Rlogin</option>
                                        <option value="Serial">Serial</option>
                                    </select>
                                </div>
                            </div>

                            <div className="adm-form-group">
                                <label htmlFor="putty_password">SSH Password</label>
                                <input
                                    type="password"
                                    id="putty_password"
                                    name="putty_password"
                                    value={formData.putty_connection.password}
                                    onChange={handleChange}
                                    className="adm-form-control"
                                    placeholder="Leave empty to keep current SSH password"
                                />
                                <small className="form-help">Leave empty to keep the current SSH password</small>
                            </div>
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
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                                <option value="Expired">Expired</option>
                            </select>
                        </div>

                        <div className="adm-form-actions">
                            <Link href={`/adm/hostings/${params.id}`} className="adm-button-secondary">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="adm-button-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Updating..." : "Update Hosting"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthWrapper>
    );
} 