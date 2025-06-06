"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

const AuthWrapper = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/adm/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!mounted || !isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default AuthWrapper;