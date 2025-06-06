"use client";

import { useEffect, useState } from "react";
import AdmNavbar from "../../../../../../components/adm/AdmNavbar";
import EditUserForm from "../../../../../../components/adm/users/EditUserForm";
import AuthWrapper from "../../../../../../components/adm/AuthWrapper";
import { getApiUrl } from '../../../../../utils/apiConfig';

interface User {
    _id: string;
    name: string;
    mail: string;
}

interface PageParams {
    params: {
        id: string;
    };
}

export default function EditUser({ params }: PageParams) {
    const userId = typeof params.id === 'string' ? params.id : '';
    
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const fetchUser = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/users/${userId}`));
                if (!res.ok) throw new Error('Failed to fetch user');
                const data = await res.json();
                setUserData(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUser();
    }, [userId, isMounted]);

    if (!isMounted) {
        return (
            <AuthWrapper>
                <div className="flex column">
                    <AdmNavbar />
                    <div id="main-content">
                        <div aria-hidden="true"></div>
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    if (loading) return (
        <AuthWrapper>
            <div className="flex">
                <AdmNavbar />
                <div id="main-content">
                    <div>Loading...</div>
                </div>
            </div>
        </AuthWrapper>
    );

    if (!userData) return (
        <AuthWrapper>
            <div className="flex">
                <AdmNavbar />
                <div id="main-content">
                    <div>User not found</div>
                </div>
            </div>
        </AuthWrapper>
    );

    return (
        <AuthWrapper>
            <div className="flex">
                <AdmNavbar />
                <div id="main-content">
                    <h1 className="adm-title">Edit User</h1>
                    <EditUserForm 
                        id={userId}
                        name={userData.name}
                        email={userData.mail}
                    />
                </div>
            </div>
        </AuthWrapper>
    );
}