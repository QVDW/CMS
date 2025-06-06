import { useState, useEffect } from "react";
import { FaUserEdit } from "react-icons/fa";
import { TbUser } from "react-icons/tb";
import RemoveBtn from "./RemoveBtn";
import Link from "next/link";
import { getApiUrl } from "../../../src/utils/apiConfig";
import Pagination from "../Pagination";

interface User {
    _id: string;
    name: string;
    mail: string;
}

const getUser = async () => {
    console.log("Fetching user data");
    try {
        const res = await fetch(getApiUrl('/api/users'), {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    } catch (error) {
        console.log(error);
        return { users: [] };
    }
};

const User = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        console.log("User component rendered");

        const fetchData = async () => {
            const data = await getUser();
            setUsers(Array.isArray(data) ? data : data?.users || []);
        };

        fetchData();
    }, []);
    
    // Get current users for the current page
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    
    // Change page
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            {users.length > 0 ? (
                <>
                    {currentUsers.map((user) => (
                        <div className="adm-item" key={user._id}>
                            <div className="adm-item-left">
                                <TbUser className="adm-item-icon"/>
                                <h2 className="adm-item-name">{user.name}</h2>
                            </div>
                            <p>{user.mail}</p>
                            <div className="adm-item-buttons">
                                <Link href={`/adm/users/edit-user/${user._id}`}><FaUserEdit /></Link>
                                <RemoveBtn id={user._id} />
                            </div>
                        </div>
                    ))}
                    
                    <Pagination 
                        totalItems={users.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <p>Geen gebruikers gevonden.</p>
            )}
        </>
    );
};

export default User;