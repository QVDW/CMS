"use client";

import { useState } from 'react';
import CardSwap, { Card } from '../../components/homepage/CardSwap'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HeroSection from "../../components/homepage/HeroSection";
import CardSwapText from '../../components/homepage/CardSwapText';
import InfoCards from '../../components/homepage/InfoCards';
import { FaPenSquare, FaAddressBook, FaRegWindowMinimize } from "react-icons/fa";
import { PiChartLineUpFill, PiBrowsers } from "react-icons/pi"; 
import { RiCloseLargeFill } from "react-icons/ri";  
import ContactSection from '../../components/homepage/ContactPreview';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div>
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <HeroSection />
      
      <div id="card-swap-container">

      <CardSwapText />

        <CardSwap
          cardDistance={25}
          verticalDistance={50}
          delay={7500}
          pauseOnHover={true}
        >
          <Card>
            <div className='card-content'>
              <div className='card-top'>
                <div className="card-tab">
                  <FaPenSquare />
                  <h3>Design</h3>
                </div>
                <div className="card-tab card-tab-icons">
                  <FaRegWindowMinimize /><PiBrowsers /><RiCloseLargeFill className="close-icon" />
                </div>
              </div>
              <div className='card-bottom'>
                <p>Websites die er prachtig uitzien op al uw apparaten.</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className='card-content'>
              <div className='card-top'>
                <div className="card-tab">
                  <FaAddressBook />
                  <h3>Contact</h3>
                </div>
                <div className="card-tab card-tab-icons">
                  <FaRegWindowMinimize /><PiBrowsers /><RiCloseLargeFill className="close-icon" />
                </div>
              </div>
              <div className='card-bottom'>
                <p>Binnen 24 uur reactie, ook in het weekend!</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className='card-content'>
              <div className='card-top'>
                <div className="card-tab">
                  <PiChartLineUpFill />
                  <h3>Uitbreiding</h3>
                </div>
                <div className="card-tab card-tab-icons">
                  <FaRegWindowMinimize /><PiBrowsers /><RiCloseLargeFill className="close-icon" />
                </div>
              </div>
              <div className='card-bottom'>
                <p>Websites gebouwd voor groei, klaar voor de toekomst!</p>
              </div>
            </div>
          </Card>
        </CardSwap>
      </div>

      <InfoCards />

      <ContactSection />

      <Footer />
    </div>
  );
}