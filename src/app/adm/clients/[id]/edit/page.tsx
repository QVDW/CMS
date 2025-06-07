"use client";

import AdmNavbar from "../../../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../../../components/adm/AuthWrapper";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditClientPage() {
    const router = useRouter();
    const params = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        company_name: "",
        contact_name: "",
        email: "",
        phone_number: "",
        address: "",
        industry: "",
        client_since: "",
        status: "Prospect"
    });

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await fetch(`/api/clients/${params.id}`);
                if (!response.ok) throw new Error("Failed to fetch client");
                const data = await response.json();
                const client = data.client;
                
                setFormData({
                    company_name: client.company_name || "",
                    contact_name: client.contact_name || "",
                    email: client.email || "",
                    phone_number: client.phone_number || "",
                    address: client.address || "",
                    industry: client.industry || "",
                    client_since: client.client_since ? client.client_since.split('T')[0] : "",
                    status: client.status || "Prospect"
                });
            } catch (error) {
                console.error("Error fetching client:", error);
                alert("Error loading client data");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchClient();
        }
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.company_name || !formData.contact_name) {
            alert("Please fill in all required fields (Company Name, Contact Name).");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/clients/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update client");
            }

            router.push("/adm/clients");
            alert("Client updated successfully.");
        } catch (error: any) {
            alert(`Error: ${error.message}`);
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
                        <h1 className="adm-title">Edit Client</h1>
                        <div className="loading-state">Loading client data...</div>
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
                    <h1 className="adm-title">Edit Client</h1>
                    <form onSubmit={handleSubmit} className="adm-form">
                        <label htmlFor="company_name">Company Name:</label>
                        <input
                            type="text"
                            id="company_name"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            placeholder="Company name"
                            required
                        />

                        <label htmlFor="contact_name">Contact Name:</label>
                        <input
                            type="text"
                            id="contact_name"
                            name="contact_name"
                            value={formData.contact_name}
                            onChange={handleChange}
                            placeholder="Primary contact name"
                            required
                        />

                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="contact@company.com"
                        />

                        <label htmlFor="phone_number">Phone Number:</label>
                        <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                        />

                        <label htmlFor="address">Address:</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Full business address"
                            rows={3}
                        />

                        <label htmlFor="industry">Industry:</label>
                        <input
                            type="text"
                            id="industry"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            placeholder="e.g., Technology, Healthcare"
                        />

                        <label htmlFor="client_since">Client Since:</label>
                        <input
                            type="date"
                            id="client_since"
                            name="client_since"
                            value={formData.client_since}
                            onChange={handleChange}
                        />

                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Prospect">Prospect</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        <button 
                            type="submit" 
                            className="adm-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Update Client"}
                        </button>
                    </form>
                </div>
            </div>
        </AuthWrapper>
    );
} 