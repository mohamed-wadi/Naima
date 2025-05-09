import React from 'react';
import styled from 'styled-components';
import Incubator from '../components/Incubator';
import { FaInfoCircle } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

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

const Home = () => {
  const { t } = useLanguage();
  
  return (
    <HomeContainer>
      <Incubator />
      
      <InfoBox>
        <InfoHeader>
          <FaInfoCircle /> {t.howToUse}
        </InfoHeader>
        <InfoText>
          {t.step1}
        </InfoText>
        <InfoText>
          {t.step2}
        </InfoText>
        <InfoText>
          {t.step3}
        </InfoText>
        <InfoText>
          {t.step4}
        </InfoText>
        <InfoText>
          {t.step5}
        </InfoText>
        <InfoText>
          {t.step6}
        </InfoText>
        <InfoText>
          {t.step7}
        </InfoText>
      </InfoBox>
    </HomeContainer>
  );
};

export default Home;
