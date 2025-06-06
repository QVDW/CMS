"use client";

import { CiSearch } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import AdmNavbar from "../../../../components/adm/AdmNavbar";
import User from "../../../../components/adm/users/User";
import Link from "next/link";
import useAuth from "../../../../hooks/useAuth";
import AuthWrapper from "../../../../components/adm/AuthWrapper";

export default function Users() {
    useAuth();

    return (
        <AuthWrapper>
            <div className="flex column">
                <AdmNavbar />
                <div id="main-content">
                    <h1 className="adm-title">Users</h1>
                    <div id="adm-search">
                        <input type="text" placeholder="Search users..." />
                        <button className="adm-search-button adm-button"><CiSearch /></button>
                        <Link href="/adm/users/add-user" className="adm-button adm-add"><IoMdAddCircleOutline /></Link>
                    </div>
                    <div className="adm-items">
                        <User />
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
}