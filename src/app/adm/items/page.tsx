"use client";

import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import AdmNavbar from "../../../../components/adm/AdmNavbar";
import Item from "../../../../components/adm/items/Item";
import Link from "next/link";
import useAuth from "../../../../hooks/useAuth";
import AuthWrapper from "../../../../components/adm/AuthWrapper";


export default function Items() {
    useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <AuthWrapper>
            <div className="flex column">
                <AdmNavbar />
                <div id="main-content">
                    <h1 className="adm-title">Items</h1>
                    <form id="adm-search" onSubmit={handleSearchSubmit}>
                        <input 
                            type="text" 
                            placeholder="Search items..." 
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <button type="submit" className="adm-search-button adm-button">
                            <CiSearch />
                        </button>
                        <Link href="/adm/items/add-item" className="adm-button adm-add">
                            <IoMdAddCircleOutline />
                        </Link>
                    </form>
                    <div className="adm-items">
                        <Item searchQuery={searchQuery} />
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
}