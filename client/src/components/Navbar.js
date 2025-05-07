import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaHistory } from 'react-icons/fa';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #28a745;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
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
`;



const Navbar = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(0);
  
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
  
  // Effect for rotating prayers every 20 seconds
  useEffect(() => {
    const prayerTimer = setInterval(() => {
      setCurrentPrayerIndex((prevIndex) => (prevIndex + 1) % prayers.length);
    }, 10000); // 10 seconds
    
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
  return (
    <NavContainer>
      <Logo>{formatDate(dateTime)} | {formatTime(dateTime)}</Logo>
      <PrayerDisplay>
        {prayers[currentPrayerIndex]}
      </PrayerDisplay>
      <NavLinks>
        <NavLink to="/">
          <FaHome /> Accueil
        </NavLink>
        <NavLink to="/history">
          <FaHistory /> Historique
        </NavLink>
      </NavLinks>
    </NavContainer>
  );
};

export default Navbar;
