import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CiMenuFries } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function Navbar({ isMenuOpen, setIsMenuOpen }: NavbarProps) {
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 880);
    };
    
    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest("#nav-menu-popup") && !target.closest("#nav-menu")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <header>
      <nav>
        <div id="nav-logo">
          <Link href="/">
            <Image 
              src="/Logo.png"
              alt="Logo"
              width={150}
              height={50}
              priority
            />
          </Link>
        </div>
      
        {!isMobile && (
          <div className="desktop-menu">
            <ul>
              <li><Link href="/collabs">Released Collabs</Link></li>
              <li><Link href="/upcoming-releases">Upcoming Collabs</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              {/* <li><Link href="/contact">Contact</Link></li> */}
            </ul>
          </div>
        )}
      
        {isMobile && (
          <button id="nav-menu" className="flex-center" onClick={toggleMenu}>
            <CiMenuFries />
          </button>
        )}
      
        {isMobile && (
          <div id="nav-menu-popup" className={isMenuOpen ? "open" : ""}>
            <div id="menu-header">
              <h2>Menu</h2>
              <button onClick={toggleMenu}><IoCloseSharp /></button>
            </div>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/collabs">Collabs</Link></li>
              <li><Link href="/upcoming-releases">Upcoming Collabs</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              {/* <li><Link href="/contact">Contact</Link></li> */}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}