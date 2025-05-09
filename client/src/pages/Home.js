import React from 'react';
import styled from 'styled-components';
import Incubator from '../components/Incubator';
import { FaInfoCircle } from 'react-icons/fa';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoBox = styled.div`
  background-color: #e2f3ff;
  border-left: 4px solid #17a2b8;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #17a2b8;
`;

const InfoText = styled.p`
  margin: 5px 0;
  line-height: 1.5;
`;

const InfoTitle = styled.span`
  font-weight: bold;
  margin-left: 10px;
`;

const InfoItem = styled.p`
  margin: 5px 0;
  line-height: 1.5;
`;

const Home = () => {
  // Translation functionality removed
  
  return (
    <HomeContainer>
      <Incubator />
      
      <InfoBox>
        <InfoHeader>
          <FaInfoCircle />
          <InfoTitle>Comment utiliser cette application</InfoTitle>
        </InfoHeader>
        <InfoItem>1. Sélectionnez une porte (gauche ou droite) pour voir les plateaux à l'intérieur.</InfoItem>
        <InfoItem>2. Cliquez sur n'importe quel plateau pour ajouter des œufs ou voir/retirer des œufs existants.</InfoItem>
        <InfoItem>3. Choisissez le type d'œuf: canard (25 jours) ou poulet (18 jours).</InfoItem>
        <InfoItem>4. Utilisez le calendrier pour une date personnalisée si vous avez ajouté les œufs avant aujourd'hui.</InfoItem>
        <InfoItem>5. Pour chaque plateau, vous verrez le nombre de jours passés dans la couveuse.</InfoItem>
        <InfoItem>6. Vous recevrez une notification à l'approche de la date d'éclosion.</InfoItem>
        <InfoItem>7. Consultez la page Historique pour voir tous les plateaux et leur statut.</InfoItem>
      </InfoBox>
    </HomeContainer>
  );
};

export default Home;
