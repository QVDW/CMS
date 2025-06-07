"use client";

import AdmNavbar from "../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../components/adm/AuthWrapper";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HiOutlineUsers } from "react-icons/hi";
import { 
    HiOutlinePlus, 
    HiOutlineSearch,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineEye,
    HiOutlineMail,
    HiOutlinePhone
} from "react-icons/hi";

interface Contact {
    _id: string;
    contact_id: string;
    client_id: string;
    name: string;
    company: string;
    role: string;
    email: string;
    phone: string;
    notes: string;
    created_at: string;
    updated_at: string;
    client?: {
        client_id: string;
        company_name: string;
        contact_name: string;
    };
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        filterContacts();
    }, [contacts, searchTerm]);

    const fetchContacts = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/contacts");
            if (!response.ok) throw new Error("Failed to fetch contacts");
            const data = await response.json();
            setContacts(data);
            setError("");
        } catch (err) {
            setError("Failed to load contacts");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filterContacts = () => {
        if (!searchTerm.trim()) {
            setFilteredContacts(contacts);
            return;
        }

        const query = searchTerm.toLowerCase().trim();
        const filtered = contacts.filter(contact =>
            contact.name.toLowerCase().includes(query) ||
            contact.contact_id.toLowerCase().includes(query) ||
            contact.company.toLowerCase().includes(query) ||
            contact.role.toLowerCase().includes(query) ||
            contact.email.toLowerCase().includes(query) ||
            contact.phone.toLowerCase().includes(query) ||
            (contact.client?.company_name && contact.client.company_name.toLowerCase().includes(query))
        );

        setFilteredContacts(filtered);
    };

    const deleteContact = async (id: string, contactName: string) => {
        if (!confirm(`Are you sure you want to delete "${contactName}"?`)) return;

        try {
            const response = await fetch(`/api/contacts?id=${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete contact");
            await fetchContacts();
        } catch (err) {
            alert("Failed to delete contact");
            console.error(err);
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
                    <h1 className="adm-title">Contacts / Team Members</h1>
                    <form id="adm-search" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="adm-search-button adm-button">
                            <HiOutlineSearch />
                        </button>
                        <Link href="/adm/contacts/add" className="adm-button adm-add">
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
                            <div className="loading-state">Loading contacts...</div>
                        ) : filteredContacts.length > 0 ? (
                            filteredContacts.map((contact) => (
                                <div className="adm-item" key={contact._id}>
                                    <div className="adm-item-left">
                                        <HiOutlineUsers className="adm-item-icon"/>
                                        <h2 className="adm-item-name">{contact.name}</h2>
                                    </div>
                                    <div className="adm-item-details">
                                        <div className="adm-item-release-date">
                                            <span>Company: </span>
                                            {contact.client ? (
                                                <strong>{contact.client.company_name}</strong>
                                            ) : (
                                                <span style={{ color: '#999' }}>Unknown Client</span>
                                            )}
                                            {contact.role && (
                                                <span> • Role: <strong>{contact.role}</strong></span>
                                            )}
                                            {contact.company && contact.company !== contact.client?.company_name && (
                                                <span> • Company: <strong>{contact.company}</strong></span>
                                            )}
                                        </div>
                                        <div className="adm-item-status">
                                            <div>
                                                <div className="status-indicator">
                                                    <span className="status-label">Contact ID:</span>
                                                    <span className="status-text">{contact.contact_id}</span>
                                                </div>
                                                {contact.email && (
                                                    <div className="status-indicator">
                                                        <span className="status-label">Email:</span>
                                                        <a href={`mailto:${contact.email}`} className="status-text contact-link">
                                                            <HiOutlineMail style={{ marginRight: '4px' }} />
                                                            {contact.email}
                                                        </a>
                                                    </div>
                                                )}
                                                {contact.phone && (
                                                    <div className="status-indicator">
                                                        <span className="status-label">Phone:</span>
                                                        <a href={`tel:${contact.phone}`} className="status-text contact-link">
                                                            <HiOutlinePhone style={{ marginRight: '4px' }} />
                                                            {contact.phone}
                                                        </a>
                                                    </div>
                                                )}
                                                <div className="status-indicator">
                                                    <span className="status-label">Added:</span>
                                                    <span className="status-text">{formatDate(contact.created_at)}</span>
                                                </div>
                                            </div>
                                            <div className="adm-item-actions">
                                                <Link href={`/adm/contacts/${contact._id}`} title="View Details">
                                                    <HiOutlineEye />
                                                </Link>
                                                <Link href={`/adm/contacts/${contact._id}/edit`} title="Edit Contact">
                                                    <HiOutlinePencil />
                                                </Link>
                                                <button
                                                    onClick={() => deleteContact(contact._id, contact.name)}
                                                    title="Delete Contact"
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
                                    <p>No contacts match your search.</p>
                                ) : (
                                    <p>No contacts found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
} 