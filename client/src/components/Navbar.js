import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaHistory, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 480px) {
    position: relative;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #28a745;
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    flex: 1;
    text-align: left;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 480px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
    width: 150px;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #495057;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e9ecef;
  }
`;

const PrayerDisplay = styled.div`
  text-align: center;
  font-family: 'Arial', sans-serif;
  color: #333;
  font-size: 1.2rem;
  direction: rtl;
  flex: 1;
  margin: 0 15px;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const TimeDisplay = styled.div`
  display: none;
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #495057;
  cursor: pointer;
  padding: 5px;
  
  @media (max-width: 480px) {
    display: block;
  }
`;

const LanguageSelector = styled.div`
  position: relative;
  margin-left: 15px;
`;

const LanguageButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const LanguageDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 20;
`;

const LanguageOption = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  border: none;
  background: none;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;


const Navbar = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr'); // 'fr' for French, 'ar' for Arabic
  
  // Array of Islamic prayers (ادعية) from the image
  const prayers = [
    "سُبْحَانَ اللّٰه",
    "الْحَمْدُلِلّٰه",
    "لَا إِلٰهَ إِلَّا اللّٰه",
    "اللّٰهُ أَكْبَر",
    "سُبْحَانَ اللّٰهِ وَ بِحَمْدِه",
    "سُبْحَانَ اللّٰهِ الْعَظِيم",
    "أَسْتَغْفِرُ اللّٰهَ وَ أَتُوبُ إِلَيْه",
    "لَا حَوْلَ وَ لَا قُوَّةَ إِلَّا بِاللّٰه",
    "اللّٰهُمَّ صَلِّ وَسَلِّم عَلَى نَبِيِّنَا مُحَمَّد",
    "لَا إِلٰهَ إِلَّا اللّٰهُ مُحَمَّدٌ رَسُولُ اللّٰه",
    "بِسْمِ اللّٰهِ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِين"
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  // Effect for rotating prayers every 6 seconds
  useEffect(() => {
    const prayerTimer = setInterval(() => {
      setCurrentPrayerIndex((prevIndex) => (prevIndex + 1) % prayers.length);
    }, 6000); // 6 seconds
    
    return () => {
      clearInterval(prayerTimer);
    };
  }, []);
  
  const formatDate = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };
  
  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('fr-FR', options);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isLangMenuOpen) setIsLangMenuOpen(false);
  };
  
  const toggleLangMenu = () => {
    setIsLangMenuOpen(!isLangMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };
  
  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setIsLangMenuOpen(false);
    // TODO: Implement actual language translation logic
    console.log(`Language changed to ${lang}`);
  };

  return (
    <NavContainer>
      <Logo>{formatDate(dateTime)} | {formatTime(dateTime)}</Logo>
      
      <PrayerDisplay>
        {prayers[currentPrayerIndex]}
      </PrayerDisplay>
      
      <LanguageSelector>
        <LanguageButton onClick={toggleLangMenu}>
          {currentLanguage === 'fr' ? '🇫🇷' : '🇩🇿'}
          <FaChevronDown size={12} />
        </LanguageButton>
        <LanguageDropdown isOpen={isLangMenuOpen}>
          <LanguageOption onClick={() => changeLanguage('fr')}>
            🇫🇷 Français
          </LanguageOption>
          <LanguageOption onClick={() => changeLanguage('ar')}>
            🇩🇿 العربية
          </LanguageOption>
        </LanguageDropdown>
      </LanguageSelector>
      
      <MenuToggle onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </MenuToggle>
      
      <NavLinks isOpen={isMenuOpen}>
        <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
          <FaHome /> Accueil
        </NavLink>
        <NavLink to="/history" onClick={() => setIsMenuOpen(false)}>
          <FaHistory /> Historique
        </NavLink>
      </NavLinks>
    </NavContainer>
  );
};

export default Navbar;
