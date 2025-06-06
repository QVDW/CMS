"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import AdmNavbar from "../../../../../components/adm/AdmNavbar";
import useAuth from "../../../../../hooks/useAuth";
import AuthWrapper from "../../../../../components/adm/AuthWrapper";
import { getApiUrl } from '../../../../utils/apiConfig';

export default function AddUser() {
    useAuth();
    
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name || !mail || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const res = await fetch(getApiUrl("/api/users"), {
                method: "POST", 
                headers: {
                    "Content-type": "application/json"
                }, 
                body: JSON.stringify({ name, mail, password }),
            });

            if (!res.ok) {
                throw new Error(res.statusText);
            } else {
                router.push("/adm/users");
                alert("User added successfully.");
            }

        }   catch (error) {
            console.log(error);
            alert("An error occurred. Please try again.");
        }
    }

    return (
        <AuthWrapper>
            <div className="flex column">
                <AdmNavbar />
                <div id="main-content">
                    <h1 className="adm-title">Add User</h1>
                    <form onSubmit={handleSubmit} className="adm-form">
                        <label htmlFor="name">Name:</label>
                        <input 
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            type="text" 
                            id="name" 
                            name="name" 
                            placeholder="John Doe"/>
                        <label htmlFor="email">Email:</label>
                        <input 
                        onChange={(e) => setMail(e.target.value)}
                        value={mail}
                        type="email" 
                        id="email" name="email" 
                        placeholder="JohnDoe@gmail.com"/>
                        <label htmlFor="password">Password:</label>
                        <input type="password" 
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            id="password" 
                            name="password" 
                            placeholder="P@s$W0rD"/>
                        <button type="submit">Add User</button>
                    </form>
                </div>
            </div>
        </AuthWrapper>
    );
}