import React, { useState, useEffect } from 'react';
import ColorPicker from '../../ColorPicker';
import Link from 'next/link';
import { TbLayoutBottombar } from "react-icons/tb";
import { FaGavel } from "react-icons/fa";

interface ColorSettings {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

const Settings: React.FC = () => {
  const [colors, setColors] = useState<ColorSettings>({
    primary: '#1976d2',
    secondary: '#9c27b0',
    accent: '#ff4081',
    text: '#000000',
    background: '#ffffff'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    setColors({
      primary: rootStyle.getPropertyValue('--primary').trim() || colors.primary,
      secondary: rootStyle.getPropertyValue('--secondary').trim() || colors.secondary,
      accent: rootStyle.getPropertyValue('--accent').trim() || colors.accent,
      text: rootStyle.getPropertyValue('--text').trim() || colors.text,
      background: rootStyle.getPropertyValue('--background').trim() || colors.background,
    });
  }, []);

  const handleColorChange = (colorType: keyof ColorSettings) => (newColor: string) => {
    setColors(prev => ({
      ...prev,
      [colorType]: newColor
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(colors),
      });

      if (!response.ok) {
        throw new Error('Failed to save colors');
      }

      Object.entries(colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });

      alert('Colors saved successfully!');
    } catch (error) {
      console.error('Error saving colors:', error);
      alert('Failed to save colors');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-container">
      <h2>Site Settings</h2>
      
      <div className="settings-links">
        <Link href="/adm/settings/footer" className="settings-link">
          <TbLayoutBottombar />
          <span>Footer Settings</span>
        </Link>
        <Link href="/adm/settings/legal" className="settings-link">
          <FaGavel />
          <span>Legal Settings</span>
        </Link>
      </div>
      
      <h3 className="settings-section-title">Website Colors</h3>
      <div className="color-theme-section">
        <div className="color-grid">
          <ColorPicker
            label="Primary Color"
            color={colors.primary}
            onChange={handleColorChange('primary')}
          />
          <ColorPicker
            label="Secondary Color"
            color={colors.secondary}
            onChange={handleColorChange('secondary')}
          />
          <ColorPicker
            label="Accent Color"
            color={colors.accent}
            onChange={handleColorChange('accent')}
          />
          <ColorPicker
            label="Text Color"
            color={colors.text}
            onChange={handleColorChange('text')}
          />
          <ColorPicker
            label="Background Color"
            color={colors.background}
            onChange={handleColorChange('background')}
          />
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="save-button"
        >
          {isSaving ? 'Saving...' : 'Save Colors'}
        </button>
      </div>
    </div>
  );
};

export default Settings;