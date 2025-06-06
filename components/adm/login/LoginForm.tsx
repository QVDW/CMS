"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.message || "An error occurred. Please try again.");
                setIsLoading(false);
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);

            router.push("/adm");
        } catch {
            setError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="adm-login-container">
            <div className="adm-login-card">
                <h1 className="adm-login-title">Admin Login</h1>
                
                {error && <div className="adm-login-error">{error}</div>}
                
                <form onSubmit={handleSubmit} className="adm-form" id="login-form">
                    <div className="adm-form-group">
                        <label htmlFor="email">Email</label>
                        <div className="adm-input-wrapper">
                            <FiMail className="adm-input-icon" />
                            <input 
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="Vul je Email in"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="adm-form-group">
                        <label htmlFor="password">Wachtwoord</label>
                        <div className="adm-input-wrapper">
                            <FiLock className="adm-input-icon" />
                            <input 
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                type={showPassword ? "text" : "password"}
                                id="password" 
                                name="password" 
                                placeholder="Vul je Wachtwoord in"
                                required
                            />
                            <button 
                                type="button"
                                className="adm-password-toggle"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                tabIndex={-1}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="adm-login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="adm-login-loading">
                                <span className="adm-spinner"></span> Inloggen...
                            </span>
                        ) : (
                            <span className="adm-login-btn-content">
                                <FiLogIn /> Inloggen
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}