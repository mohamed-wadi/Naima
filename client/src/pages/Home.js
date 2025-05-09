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
  
  @media (max-width: 480px) {
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-left-width: 3px;
  }
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #17a2b8;
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 8px;
    gap: 5px;
  }
`;

const InfoText = styled.p`
  margin: 5px 0;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    margin: 4px 0;
    font-size: 0.85rem;
    line-height: 1.4;
  }
`;

const Home = () => {
  return (
    <HomeContainer>
      <Incubator />
      
      <InfoBox>
        <InfoHeader>
          <FaInfoCircle /> Comment utiliser cette application
        </InfoHeader>
        <InfoText>
          1. Sélectionnez une porte (gauche ou droite) pour voir les plateaux à l'intérieur.
        </InfoText>
        <InfoText>
          2. Cliquez sur n'importe quel plateau pour ajouter des œufs ou voir/retirer des œufs existants.
        </InfoText>
        <InfoText>
          3. Pour chaque plateau, vous verrez le nombre de jours passés dans la couveuse.
        </InfoText>
        <InfoText>
          4. Vous recevrez une notification lorsqu'un plateau aura été dans la couveuse pendant 18 jours.
        </InfoText>
        <InfoText>
          5. Consultez la page Historique pour voir tous les plateaux et leur statut.
        </InfoText>
      </InfoBox>
    </HomeContainer>
  );
};

export default Home;
