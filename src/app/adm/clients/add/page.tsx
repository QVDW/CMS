"use client";

import AdmNavbar from "../../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../../components/adm/AuthWrapper";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddClientPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            const response = await fetch("/api/clients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create client");
            }

            router.push("/adm/clients");
            alert("Client added successfully.");
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthWrapper>
            <div className="flex column">
                <AdmNavbar />
                <div id="main-content">
                    <h1 className="adm-title">Add Client</h1>
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
                            {isSubmitting ? "Creating..." : "Add Client"}
                        </button>
                    </form>
                </div>
            </div>
        </AuthWrapper>
    );
} 