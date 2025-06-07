"use client";

import AdmNavbar from "../../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../../components/adm/AuthWrapper";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlinePencil, HiOutlineUsers, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

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
        email?: string;
    };
}

export default function ViewContactPage() {
    const params = useParams();
    const [contact, setContact] = useState<Contact | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (params.id) {
            fetchContact();
        }
    }, [params.id]);

    const fetchContact = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/contacts/${params.id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError("Contact not found");
                    return;
                }
                throw new Error("Failed to fetch contact");
            }
            const data = await response.json();
            setContact(data.contact);
            setError("");
        } catch (err) {
            setError("Failed to load contact");
            console.error(err);
        } finally {
            setIsLoading(false);
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
                        <div className="loading-state">Loading contact...</div>
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
                        <Link href="/adm/contacts" className="adm-button-secondary">
                            Back to Contacts
                        </Link>
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    if (!contact) {
        return (
            <AuthWrapper>
                <div className="flex column">
                    <AdmNavbar />
                    <div id="main-content">
                        <div className="error-message">Contact not found</div>
                        <Link href="/adm/contacts" className="adm-button-secondary">
                            Back to Contacts
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
                        <Link href="/adm/contacts" className="adm-back-button">
                            <HiOutlineArrowLeft />
                        </Link>
                        <h1 className="adm-title">
                            <HiOutlineUsers style={{ marginRight: '8px' }} />
                            {contact.name}
                        </h1>
                        <Link href={`/adm/contacts/${contact._id}/edit`} className="adm-button-primary">
                            <HiOutlinePencil />
                            Edit Contact
                        </Link>
                    </div>

                    <div className="adm-view-container">
                        <div className="adm-view-section">
                            <h2>Contact Information</h2>
                            <div className="adm-view-grid">
                                <div className="adm-view-field">
                                    <label>Contact ID</label>
                                    <span>{contact.contact_id}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Name</label>
                                    <span>{contact.name}</span>
                                </div>
                                {contact.role && (
                                    <div className="adm-view-field">
                                        <label>Role / Position</label>
                                        <span>{contact.role}</span>
                                    </div>
                                )}
                                {contact.company && (
                                    <div className="adm-view-field">
                                        <label>Company</label>
                                        <span>{contact.company}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="adm-view-section">
                            <h2>Contact Details</h2>
                            <div className="adm-view-grid">
                                {contact.email && (
                                    <div className="adm-view-field">
                                        <label>Email</label>
                                        <a href={`mailto:${contact.email}`} className="adm-link">
                                            <HiOutlineMail style={{ marginRight: '4px' }} />
                                            {contact.email}
                                        </a>
                                    </div>
                                )}
                                {contact.phone && (
                                    <div className="adm-view-field">
                                        <label>Phone</label>
                                        <a href={`tel:${contact.phone}`} className="adm-link">
                                            <HiOutlinePhone style={{ marginRight: '4px' }} />
                                            {contact.phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="adm-view-section">
                            <h2>Client Information</h2>
                            <div className="adm-view-grid">
                                {contact.client ? (
                                    <>
                                        <div className="adm-view-field">
                                            <label>Client ID</label>
                                            <span>{contact.client.client_id}</span>
                                        </div>
                                        <div className="adm-view-field">
                                            <label>Company Name</label>
                                            <Link href={`/adm/clients/${contact.client_id}`} className="adm-link">
                                                {contact.client.company_name}
                                            </Link>
                                        </div>
                                        <div className="adm-view-field">
                                            <label>Primary Contact</label>
                                            <span>{contact.client.contact_name}</span>
                                        </div>
                                        {contact.client.email && (
                                            <div className="adm-view-field">
                                                <label>Client Email</label>
                                                <a href={`mailto:${contact.client.email}`} className="adm-link">
                                                    {contact.client.email}
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

                        {contact.notes && (
                            <div className="adm-view-section">
                                <h2>Notes</h2>
                                <div className="adm-view-description">
                                    {contact.notes}
                                </div>
                            </div>
                        )}

                        <div className="adm-view-section">
                            <h2>Timeline</h2>
                            <div className="adm-view-grid">
                                <div className="adm-view-field">
                                    <label>Created</label>
                                    <span>{formatDate(contact.created_at)}</span>
                                </div>
                                <div className="adm-view-field">
                                    <label>Last Updated</label>
                                    <span>{formatDate(contact.updated_at)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="adm-view-actions">
                            <Link href="/adm/contacts" className="adm-button-secondary">
                                Back to Contacts
                            </Link>
                            <Link href={`/adm/contacts/${contact._id}/edit`} className="adm-button-primary">
                                Edit Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
} 