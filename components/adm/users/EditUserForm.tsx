"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getApiUrl } from "../../../src/utils/apiConfig";

interface EditUserFormProps {
    id: string;
    name: string;
    email: string;
}

export default function EditUserForm({ id, name, email }: EditUserFormProps) {
    const [newName, setNewName] = useState(name);
    const [newEmail, setNewEmail] = useState(email);
    const [newPassword, setNewPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updateData = {
            name: newName,
            email: newEmail,
            ...(newPassword && { password: newPassword })
        };

        try {
            const res = await fetch(getApiUrl(`/api/users/${id}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (!res.ok) {
                throw new Error(res.status.toString());
            }

            console.log("Update successful");
            router.push("/adm/users");
        } catch (error) {
            console.log("Error updating user:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="adm-form">
            <label htmlFor="name">Naam:</label>
            <input 
                onChange={(e) => setNewName(e.target.value)}
                value={newName}
                type="text" 
                id="name" 
                name="name" 
                placeholder="John Doe"
            />
            <label htmlFor="email">Email:</label>
            <input 
                onChange={(e) => setNewEmail(e.target.value)}
                value={newEmail}
                type="email" 
                id="email" 
                name="email" 
                placeholder="JohnDoe@gmail.com"
            />
            <label htmlFor="password">Nieuw Wachtwoord (optioneel):</label>
            <input 
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                type="password" 
                id="password" 
                name="password" 
                placeholder="Laat leeg om huidig wachtwoord te behouden"
            />
            <button type="submit">Gebruiker bijwerken</button>
        </form>
    );
}