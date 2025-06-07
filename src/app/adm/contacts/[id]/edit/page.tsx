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
}

export default function EditContactPage() {
    const params = useParams();
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [formData, setFormData] = useState({
        client_id: "",
        name: "",
        company: "",
        role: "",
        email: "",
        phone: "",
        notes: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (params.id) {
            fetchContact();
            fetchClients();
        }
    }, [params.id]);

    const fetchContact = async () => {
        try {
            const response = await fetch(`/api/contacts/${params.id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError("Contact not found");
                    return;
                }
                throw new Error("Failed to fetch contact");
            }
            const data = await response.json();
            const contact: Contact = data.contact;
            setFormData({
                client_id: contact.client_id,
                name: contact.name,
                company: contact.company,
                role: contact.role,
                email: contact.email,
                phone: contact.phone,
                notes: contact.notes
            });
        } catch (err) {
            setError("Failed to load contact");
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
            const response = await fetch(`/api/contacts/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update contact");
            }

            router.push(`/adm/contacts/${params.id}`);
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
                        <div className="loading-state">Loading contact...</div>
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    if (error && !formData.name) {
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

    return (
        <AuthWrapper>
            <div className="flex column">
                <AdmNavbar />
                <div id="main-content">
                    <div className="adm-form-header">
                        <Link href={`/adm/contacts/${params.id}`} className="adm-back-button">
                            <HiOutlineArrowLeft />
                        </Link>
                        <h1 className="adm-title">Edit Contact</h1>
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
                            <label htmlFor="name">Contact Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="adm-form-control"
                                placeholder="Enter contact name"
                                required
                            />
                        </div>

                        <div className="adm-form-group">
                            <label htmlFor="company">Company</label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="adm-form-control"
                                placeholder="Enter company name (if different from client)"
                            />
                        </div>

                        <div className="adm-form-group">
                            <label htmlFor="role">Role / Position</label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="adm-form-control"
                                placeholder="e.g., Project Manager, Developer, Designer"
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
                                placeholder="Enter email address"
                            />
                        </div>

                        <div className="adm-form-group">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="adm-form-control"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="adm-form-group">
                            <label htmlFor="notes">Notes</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="adm-form-control"
                                placeholder="Additional notes about this contact"
                                rows={4}
                            />
                        </div>

                        <div className="adm-form-actions">
                            <Link href={`/adm/contacts/${params.id}`} className="adm-button-secondary">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="adm-button-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Updating..." : "Update Contact"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthWrapper>
    );
} 