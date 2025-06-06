"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuth = (skipCheck = false) => {
    const router = useRouter();

    useEffect(() => {
        console.log("useAuth useEffect triggered");

        if (skipCheck) return;

        const checkAuth = () => {
            console.log("Checking authentication");

            const token = localStorage.getItem("token");
            const isAuthenticated = !!token;

            if (!isAuthenticated) {
                console.log("User not authenticated, redirecting to login");
                router.push("/adm/login");
            }
        };

        checkAuth();

        const intervalId = setInterval(checkAuth, 300000);

        return () => clearInterval(intervalId);
    }, [router, skipCheck]);
};

export default useAuth;