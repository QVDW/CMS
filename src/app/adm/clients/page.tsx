"use client";

import AdmNavbar from "../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../components/adm/AuthWrapper";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
    HiOutlineOfficeBuilding, 
    HiOutlinePlus, 
    HiOutlineSearch,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineEye
} from "react-icons/hi";
import { FaCircle } from "react-icons/fa";

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

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        filterClients();
    }, [clients, searchTerm]);

    const fetchClients = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/clients");
            if (!response.ok) throw new Error("Failed to fetch clients");
            const data = await response.json();
            setClients(data);
            setError("");
        } catch (err) {
            setError("Failed to load clients");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filterClients = () => {
        if (!searchTerm.trim()) {
            setFilteredClients(clients);
            return;
        }

        const query = searchTerm.toLowerCase().trim();
        const filtered = clients.filter(client =>
            client.company_name.toLowerCase().includes(query) ||
            client.contact_name.toLowerCase().includes(query) ||
            client.client_id.toLowerCase().includes(query) ||
            client.email.toLowerCase().includes(query) ||
            client.industry.toLowerCase().includes(query)
        );

        setFilteredClients(filtered);
    };

    const deleteClient = async (id: string, clientName: string) => {
        if (!confirm(`Are you sure you want to delete "${clientName}"?`)) return;

        try {
            const response = await fetch(`/api/clients?id=${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete client");
            await fetchClients();
        } catch (err) {
            alert("Failed to delete client");
            console.error(err);
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Active': return 'active';
            case 'Inactive': return 'inactive';
            case 'Prospect': return 'prospect';
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
                    <h1 className="adm-title">Clients</h1>
                    <form id="adm-search" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="adm-search-button adm-button">
                            <HiOutlineSearch />
                        </button>
                        <Link href="/adm/clients/add" className="adm-button adm-add">
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
                            <div className="loading-state">Loading clients...</div>
                        ) : filteredClients.length > 0 ? (
                            filteredClients.map((client) => (
                                <div className="adm-item" key={client._id}>
                                    <div className="adm-item-left">
                                        <HiOutlineOfficeBuilding className="adm-item-icon"/>
                                        <h2 className="adm-item-name">{client.company_name}</h2>
                                    </div>
                                    <div className="adm-item-details">
                                        <div className="adm-item-release-date">
                                            <span>Contact: </span>
                                            {client.contact_name}
                                            {client.email && (
                                                <span> ({client.email})</span>
                                            )}
                                        </div>
                                        <div className="adm-item-status">
                                            <div>
                                                <div className="status-indicator">
                                                    <span className="status-label">Status:</span>
                                                    <FaCircle className={`status-circle ${getStatusClass(client.status)}`} />
                                                    <span className="status-text">{client.status}</span>
                                                </div>
                                                <div className="status-indicator">
                                                    <span className="status-label">Client Since:</span>
                                                    <span className="status-text">{formatDate(client.client_since)}</span>
                                                </div>
                                                {client.industry && (
                                                    <div className="status-indicator">
                                                        <span className="status-label">Industry:</span>
                                                        <span className="status-text">{client.industry}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="adm-item-actions">
                                                <Link href={`/adm/clients/${client._id}`} title="View Details">
                                                    <HiOutlineEye />
                                                </Link>
                                                <Link href={`/adm/clients/${client._id}/edit`} title="Edit Client">
                                                    <HiOutlinePencil />
                                                </Link>
                                                <button
                                                    onClick={() => deleteClient(client._id, client.company_name)}
                                                    title="Delete Client"
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
                                    <p>No clients match your search.</p>
                                ) : (
                                    <p>No clients found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
}