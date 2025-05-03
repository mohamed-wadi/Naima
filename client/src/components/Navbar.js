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

const Navbar = () => {
  const [dateTime, setDateTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
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
