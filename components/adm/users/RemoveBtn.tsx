'use client';

import { IoTrashOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../../../src/utils/apiConfig";

interface RemoveBtnProps {
  id: string;
}

export default function RemoveBtn({ id }: RemoveBtnProps) {
    const router = useRouter();
    const removeUser = async () => {
        const confirmed = confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?");
        
        if (confirmed) {
            await fetch(getApiUrl(`/api/users?id=${id}`), {
                method: "DELETE",
            });
            router.push("/adm/users");
        }
    };
            
    return (
        <button onClick={removeUser} id="remove-btn">
            <IoTrashOutline />
        </button>
    );
}