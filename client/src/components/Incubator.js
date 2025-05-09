import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TrayModal from './TrayModal';
import { getActiveTrays } from '../services/traysService';
// Duck and chicken emojis are used for direct display

const IncubatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const IncubatorTitle = styled.h2`
  margin-bottom: 20px;
  color: #343a40;
  text-align: center;
`;

const IncubatorFrame = styled.div`
  border: 4px solid #343a40;
  border-radius: 8px;
  padding: 20px;
  background-color: #f8f9fa;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const FrameLabel = styled.div`
  position: absolute;
  top: 10px;
  width: 100%;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
`;

const SignatureLabel = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
  font-style: italic;
  color: #6c757d;
`;

const DoorsContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 30px;
`;

const Door = styled.div`
  width: 50%;
  height: 200px;
  border: 2px solid #343a40;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
  background-color: #e9ecef;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #ced4da;
  }
`;

const OpenDoorContainer = styled.div`
  border: 4px solid #343a40;
  border-radius: 8px;
  padding: 20px;
  background-color: #f8f9fa;
  width: 100%;
  max-width: 600px;
  position: relative;
`;

const DoorHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  background-color: ${props => props.isOpen ? '#28a745' : '#6c757d'};
  color: white;
  padding: 10px;
  border-radius: 4px;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  left: 10px;
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RowLabel = styled.div`
  width: 100px;
  font-weight: bold;
`;

const Tray = styled.div`
  flex: 1;
  height: 60px;
  background-color: ${props => props.active ? '#28a745' : '#e9ecef'};
  border: 2px solid #343a40;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin: 0 5px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const TrayLabel = styled.div`
  font-weight: bold;
  color: ${props => props.active ? 'white' : '#343a40'};
  font-size: 2.5rem; /* Agrandissement de la taille de l'icône */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const DaysIndicator = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: ${props => {
    const threshold = props.eggType === 'duck' ? 23 : 16; // Adjust threshold based on egg type
    const midThreshold = props.eggType === 'duck' ? 15 : 10;
    if (props.days >= threshold) return '#dc3545';
    if (props.days >= midThreshold) return '#ffc107';
    return '#17a2b8';
  }};
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: bold;
`;

const Incubator = () => {
  const [view, setView] = useState('closed'); // 'closed', 'leftDoor', 'rightDoor'
  const [trays, setTrays] = useState([]);
  const [selectedTray, setSelectedTray] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Fetch active trays using service
    const fetchTrays = async () => {
      try {
        const activeTrays = await getActiveTrays();
        setTrays(activeTrays);
      } catch (error) {
        console.error('Error fetching active trays:', error);
      }
    };
    
    fetchTrays();
    
    // Refresh data every minute
    const interval = setInterval(fetchTrays, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Calculate days in incubator
  const calculateDaysInIncubator = (addedDate) => {
    const added = new Date(addedDate);
    const now = new Date();
    const diffTime = Math.abs(now - added);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Check if a tray is active
  const isTrayActive = (door, row, position) => {
    return trays.some(tray => 
      tray.door === door && 
      tray.row === row && 
      tray.position === position
    );
  };
  
  // Get tray data if active
  const getTrayData = (door, row, position) => {
    return trays.find(tray => 
      tray.door === door && 
      tray.row === row && 
      tray.position === position
    );
  };
  
  // Handle door click in closed view
  const handleDoorClick = (door) => {
    setView(door === 'left' ? 'leftDoor' : 'rightDoor');
  };
  
  // Handle back button in open door view
  const handleBackClick = () => {
    setView('closed');
  };
  
  // Handle tray click
  const handleTrayClick = (door, row) => {
    const doorValue = door === 'leftDoor' ? 'left' : 'right';
    const position = doorValue === 'left' ? 'right' : 'left'; // Position doesn't matter for this design
    
    const trayData = getTrayData(doorValue, row, position);
    
    setSelectedTray({
      door: doorValue,
      row,
      position,
      existingTray: trayData
    });
    
    setIsModalOpen(true);
  };
  
  // Handle modal close
  const handleModalClose = async (refresh = false) => {
    setIsModalOpen(false);
    setSelectedTray(null);
    
    if (refresh) {
      // Refresh trays data
      try {
        const activeTrays = await getActiveTrays();
        setTrays(activeTrays);
      } catch (error) {
        console.error('Error refreshing trays:', error);
      }
    }
  };
  
  // Render closed incubator view
  const renderClosedView = () => (
    <IncubatorFrame>
      <FrameLabel>Couveuse</FrameLabel>
      {/* Signature removed */}
      <DoorsContainer>
        <Door onClick={() => handleDoorClick('left')}>
          Porte Gauche
        </Door>
        <Door onClick={() => handleDoorClick('right')}>
          Porte Droite
        </Door>
      </DoorsContainer>
    </IncubatorFrame>
  );
  
  // Render open door view
  const renderOpenDoorView = (door) => {
    const doorValue = door === 'leftDoor' ? 'left' : 'right';
    const doorLabel = doorValue === 'left' ? 'Porte Gauche' : 'Porte Droite';
    
    return (
      <OpenDoorContainer>
        <DoorHeader isOpen={true}>
          <BackButton onClick={handleBackClick}>←</BackButton>
          <span>{doorLabel}</span>
          {/* Signature removed */}
        </DoorHeader>
        
        {[1, 2, 3].map(row => (
          <Row key={row}>
            <RowLabel>Plateau {row}</RowLabel>
            <Tray 
              active={isTrayActive(doorValue, row, doorValue === 'left' ? 'right' : 'left')}
              onClick={() => handleTrayClick(door, row)}
            >
              {/* Une seule icône grande et centrée */}
              <TrayLabel active={isTrayActive(doorValue, row, doorValue === 'left' ? 'right' : 'left')}>
                {isTrayActive(doorValue, row, doorValue === 'left' ? 'right' : 'left') ? (
                  getTrayData(doorValue, row, doorValue === 'left' ? 'right' : 'left')?.eggType === 'duck' ? '🦆' : '🐔' // Display emoji icon if active
                ) : '+'}
              </TrayLabel>
              
              {isTrayActive(doorValue, row, doorValue === 'left' ? 'right' : 'left') && (
                <DaysIndicator 
                  days={calculateDaysInIncubator(getTrayData(doorValue, row, doorValue === 'left' ? 'right' : 'left').addedDate)}
                  eggType={getTrayData(doorValue, row, doorValue === 'left' ? 'right' : 'left').eggType || 'chicken'}
                >
                  {calculateDaysInIncubator(getTrayData(doorValue, row, doorValue === 'left' ? 'right' : 'left').addedDate)}
                </DaysIndicator>
              )}
            </Tray>
          </Row>
        ))}
      </OpenDoorContainer>
    );
  };
  
  return (
    <IncubatorContainer>
      <IncubatorTitle>Suivi d'Incubation</IncubatorTitle>
      
      {view === 'closed' && renderClosedView()}
      {view === 'leftDoor' && renderOpenDoorView('leftDoor')}
      {view === 'rightDoor' && renderOpenDoorView('rightDoor')}
      
      {isModalOpen && selectedTray && (
        <TrayModal 
          tray={selectedTray} 
          onClose={handleModalClose} 
        />
      )}
    </IncubatorContainer>
  );
};

export default Incubator;
