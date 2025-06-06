"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

interface FooterItem {
  text: string;
  link: string;
  isExternal: boolean;
}

interface FooterColumn {
  title: string;
  items: FooterItem[];
}

interface SocialMedia {
  youtube: string;
  facebook: string;
  instagram: string;
  twitter: string;
}

interface FooterSettings {
  columns: FooterColumn[];
  socialMedia: SocialMedia;
  backgroundColor: string;
  textColor: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings>({
    columns: [
      {
        title: "Title",
        items: [
          { text: "Item 1", link: "/", isExternal: false },
          { text: "Item 2", link: "/", isExternal: false },
          { text: "Item 3", link: "/", isExternal: false }
        ]
      },
      {
        title: "Title",
        items: [
          { text: "Item 1", link: "/", isExternal: false },
          { text: "Item 2", link: "/", isExternal: false },
          { text: "Item 3", link: "/", isExternal: false }
        ]
      },
      {
        title: "Title",
        items: [
          { text: "Item 1", link: "/", isExternal: false },
          { text: "Item 2", link: "/", isExternal: false },
          { text: "Item 3", link: "/", isExternal: false }
        ]
      },
      {
        title: "Title",
        items: [
          { text: "Item 1", link: "/", isExternal: false },
          { text: "Item 2", link: "/", isExternal: false },
          { text: "Item 3", link: "/", isExternal: false }
        ]
      }
    ],
    socialMedia: {
      youtube: "",
      facebook: "",
      instagram: "",
      twitter: ""
    },
    backgroundColor: "#202020",
    textColor: "#fefefe"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        console.log('[Footer] Fetching footer settings');
        const res = await fetch('/api/settings/footer');
        
        if (!res.ok) {
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('[Footer] Settings received from API:', data);
        console.log('[Footer] Social media data received:', data.socialMedia);
        
        const parsedSettings: FooterSettings = {
          columns: Array.isArray(data.columns) ? data.columns : settings.columns,
          socialMedia: {
            youtube: data.socialMedia?.youtube || "",
            facebook: data.socialMedia?.facebook || "",
            instagram: data.socialMedia?.instagram || "",
            twitter: data.socialMedia?.twitter || ""
          },
          backgroundColor: data.backgroundColor || "#202020",
          textColor: data.textColor || "#fefefe"
        };
        
        console.log('[Footer] Using parsed social media data:', parsedSettings.socialMedia);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('[Footer] Error fetching footer settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterSettings();
  }, []);

  const renderLink = (item: FooterItem) => {
    if (item.isExternal) {
      return (
        <a href={item.link} target="_blank" rel="noopener noreferrer">
          {item.text}
        </a>
      );
    }
    return <Link href={item.link}>{item.text}</Link>;
  };

  const hasSocialMedia = settings.socialMedia && Object.values(settings.socialMedia).some(link => link && link.trim() !== "");

  const hasSocialMediaLink = (platform: keyof SocialMedia): boolean => {
    return Boolean(settings.socialMedia && 
                  settings.socialMedia[platform] && 
                  settings.socialMedia[platform].trim() !== "");
  };

  const iconStyle = {
    color: settings.textColor,
    fontSize: '1.5rem'
  };

  if (isLoading) {
    return null;
  }

  return (
    <footer style={{ backgroundColor: settings.backgroundColor, color: settings.textColor }}>
      {settings.columns.map((column, index) => (
        <div key={index} className="footer-column">
          <h3>{column.title}</h3>
          <ul>
            {column.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                {renderLink(item)}
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      {hasSocialMedia && (
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            {hasSocialMediaLink('youtube') && (
              <a href={settings.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaYoutube style={iconStyle} />
              </a>
            )}
            {hasSocialMediaLink('facebook') && (
              <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaFacebook style={iconStyle} />
              </a>
            )}
            {hasSocialMediaLink('instagram') && (
              <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaInstagram style={iconStyle} />
              </a>
            )}
            {hasSocialMediaLink('twitter') && (
              <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaTwitter style={iconStyle} />
              </a>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}