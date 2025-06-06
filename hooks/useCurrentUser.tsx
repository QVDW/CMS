"use client";

import { useState, useEffect, useCallback } from "react";

interface User {
    _id: string;
    name: string;
    mail: string;
}

export default function useCurrentUser() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchCurrentUser = useCallback(async () => {
        if (!mounted) return;

        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                setError("No authentication token found");
                setIsLoading(false);
                return;
            }
            
            const response = await fetch("/api/auth/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.status}`);
            }
            
            const userData = await response.json();
            setUser(userData);
        } catch (err) {
            console.error("Error fetching current user:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch user data");
        } finally {
            setIsLoading(false);
        }
    }, [mounted]);

    useEffect(() => {
        if (mounted) {
            fetchCurrentUser();
        }
    }, [fetchCurrentUser, mounted]);

    return { user, isLoading, error, refetch: fetchCurrentUser };
} 