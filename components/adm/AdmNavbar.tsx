import { TbAppWindow } from "react-icons/tb";
import { TbUser } from "react-icons/tb";
import { TbSettings } from "react-icons/tb";
import { TbFilterQuestion } from "react-icons/tb";
import { IoImageOutline } from "react-icons/io5";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdOutlineWork } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi";
import { HiOutlineServer } from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdmNavbar() {
    const pathname = usePathname();
    
    const isActive = (path: string) => {
        if (path === "/adm") {
            return pathname === "/adm" ? "active" : "";
        }
        return pathname?.startsWith(path) ? "active" : "";
    };
    
    return (
        <div id="adm-navbar">
            <div id="adm-logo">
                <Link href="/adm" className={isActive("/adm")}>
                    <TbAppWindow />
                    <span className="tooltip">Dashboard</span>
                </Link>
            </div>
            <div id="adm-data">
                <Link href="/adm/users" className={isActive("/adm/users")}>
                    <TbUser />
                    <span className="tooltip">Users</span>
                </Link>
                <Link href="/adm/clients" className={isActive("/adm/clients")}>
                    <HiOutlineOfficeBuilding />
                    <span className="tooltip">Clients</span>
                </Link>
                <Link href="/adm/projects" className={isActive("/adm/projects")}>
                    <MdOutlineWork />
                    <span className="tooltip">Projects</span>
                </Link>
                <Link href="/adm/hostings" className={isActive("/adm/hostings")}>
                    <HiOutlineServer />
                    <span className="tooltip">Hostings</span>
                </Link>
                <Link href="/adm/contacts" className={isActive("/adm/contacts")}>
                    <HiOutlineUsers />
                    <span className="tooltip">Contacts</span>
                </Link>
                <Link href="/adm/items" className={isActive("/adm/items")}>
                    <IoImageOutline />
                    <span className="tooltip">Items</span>
                </Link>
                <Link href="/adm/faq" className={isActive("/adm/faq")}>
                    <TbFilterQuestion />
                    <span className="tooltip">FAQ</span>
                </Link>
                <Link href="/adm/settings" className={isActive("/adm/settings")}>
                    <TbSettings />
                    <span className="tooltip">Settings</span>
                </Link>
            </div>
        </div>
    );
}