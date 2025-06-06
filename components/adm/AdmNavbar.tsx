import { TbAppWindow } from "react-icons/tb";
import { TbUser } from "react-icons/tb";
import { TbSettings } from "react-icons/tb";
import { TbFilterQuestion } from "react-icons/tb";
import { IoImageOutline } from "react-icons/io5";
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