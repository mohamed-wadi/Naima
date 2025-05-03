import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes, FaCalendarAlt, FaCheck, FaTrash, FaClock } from 'react-icons/fa';
import { GiChicken, GiDuck } from 'react-icons/gi';
import { addTray, removeTray } from '../services/traysService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #343a40;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #343a40;
  }
`;

const TrayInfo = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const TrayInfoItem = styled.p`
  margin: 5px 0;
  font-size: 1rem;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const OptionButton = styled.button`
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 15px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color || '#6c757d'};
  color: white;
`;

const DatePickerContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 10px;
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
`;

const CalendarIcon = styled.div`
  position: absolute;
  right: 10px;
  color: #6c757d;
`;

const ConfirmationContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
`;

const ConfirmationText = styled.p`
  margin-bottom: 15px;
  font-size: 1rem;
  color: #dc3545;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const AddButton = styled(Button)`
  background-color: #28a745;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #218838;
  }
`;

const RemoveButton = styled(Button)`
  background-color: #dc3545;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #c82333;
  }
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;
  color: white;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const TypeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  margin: 0 5px;
  border: 3px solid ${props => props.selected ? '#28a745' : '#ced4da'};
  border-radius: 8px;
  background-color: ${props => props.selected ? '#e8f5e9' : '#f8f9fa'};
  cursor: pointer;
  width: 100%;
  transition: all 0.3s;
  
  &:hover {
    background-color: ${props => props.selected ? '#e8f5e9' : '#e9ecef'};
    border-color: ${props => props.selected ? '#28a745' : '#adb5bd'};
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const TypeIcon = styled.div`
  font-size: 2.2rem;
  margin-bottom: 10px;
  color: ${props => {
    if (!props.selected) return '#6c757d';
    return props.eggType === 'duck' ? '#17a2b8' : '#ffc107';
  }};
`;

const TypeText = styled.div`
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  color: ${props => {
    if (!props.selected) return '#343a40';
    return props.eggType === 'duck' ? '#17a2b8' : '#ffc107';
  }};
`;

const TypeSelector = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
`;

const TrayModal = ({ tray, onClose }) => {
  const [step, setStep] = useState('initial'); // 'initial', 'calendar', 'confirm-remove', 'select-type'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState('chicken'); // 'chicken' or 'duck'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { door, row, position, existingTray } = tray;
  
  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate days in incubator
  const calculateDaysInIncubator = (addedDate) => {
    const added = new Date(addedDate);
    const now = new Date();
    const diffTime = Math.abs(now - added);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Calculate removal date based on egg type (18 days for chicken, 25 for duck)
  const calculateRemovalDate = (addedDate, eggType = 'chicken') => {
    const date = new Date(addedDate);
    // Add 18 days for chicken, 25 for duck
    date.setDate(date.getDate() + (eggType === 'duck' ? 25 : 18));
    return date;
  };

  // Get incubation duration text based on egg type
  const getIncubationDurationText = (eggType) => {
    return eggType === 'duck' ? '25 jours' : '18 jours';
  };

  // Handle adding a new tray with current date
  const handleAddTrayWithCurrentDate = () => {
    // Vérifier si un type d'œuf a été sélectionné
    if (!selectedType) {
      setError('Veuillez sélectionner un type d\'œuf');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create new tray object with the selected egg type
      const newTray = {
        door: door,
        row: row, 
        position: position,
        eggType: selectedType,
        addedDate: new Date(),
        count: 1
      };
      
      // Call mock service to add tray
      addTray({
        door,
        row,
        position,
        eggType: selectedType,
        addedDate: new Date()
      });
      
      // Close modal with refresh signal
      onClose(true);
    } catch (err) {
      setError('Erreur lors de l\'ajout du plateau.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle adding a new tray with selected date
  const handleAddTrayWithSelectedDate = async () => {
    // Vérifier si un type d'œuf a été sélectionné
    if (!selectedType) {
      setError('Veuillez sélectionner un type d\'œuf');
      return;
    }
    
    if (!selectedDate) {
      setError('Veuillez sélectionner une date');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Add tray with selected date
      await addTray({
        door,
        row,
        position,
        addedDate: selectedDate,
        notes: '',
        eggType: selectedType
      });
      
      onClose(true);
    } catch (error) {
      console.error('Error adding tray:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'ajout du plateau');
      setLoading(false);
    }
  };

  // Handle removing a tray
  const handleRemoveTray = async () => {
    try {
      setLoading(true);
      setError('');
      
      removeTray(existingTray._id);
      
      setLoading(false);
      onClose(true); // Close modal and refresh data
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Une erreur est survenue lors de la suppression du plateau');
    }
  };
  
  // Render initial view with options
  const renderInitialView = () => {
    if (existingTray) {
      // Existing tray with remove option
      return (
        <>
          <TrayInfo>
            <TrayInfoItem><strong>Porte:</strong> {door === 'left' ? 'Gauche' : 'Droite'}</TrayInfoItem>
            <TrayInfoItem><strong>Plateau:</strong> {row}</TrayInfoItem>
            <TrayInfoItem><strong>Type:</strong> {existingTray.eggType === 'duck' ? (
              <span><GiDuck style={{ verticalAlign: 'middle', marginRight: '5px', color: '#0099cc' }} /> Canard</span>
            ) : (
              <span><GiChicken style={{ verticalAlign: 'middle', marginRight: '5px', color: '#ff9900' }} /> Poulet</span>
            )}</TrayInfoItem>
            <TrayInfoItem><strong>Date d'ajout:</strong> {formatDate(existingTray.addedDate)}</TrayInfoItem>
            <TrayInfoItem><strong>Jours dans la couveuse:</strong> {calculateDaysInIncubator(existingTray.addedDate)}</TrayInfoItem>
            <TrayInfoItem><strong>Date de retrait prévue:</strong> {formatDate(calculateRemovalDate(existingTray.addedDate, existingTray.eggType))} <small>({getIncubationDurationText(existingTray.eggType)} d'incubation)</small></TrayInfoItem>
          </TrayInfo>
          
          <OptionButton onClick={() => setStep('confirm-remove')}>
            <IconWrapper color="#dc3545">
              <FaTrash />
            </IconWrapper>
            Retirer le plateau
          </OptionButton>
          
          <ButtonGroup>
            <CancelButton onClick={() => onClose()}>
              Fermer
            </CancelButton>
          </ButtonGroup>
        </>
      );
    } else {
      // New tray with add options
      return (
        <>
          <TrayInfo>
            <TrayInfoItem><strong>Porte:</strong> {door === 'left' ? 'Gauche' : 'Droite'}</TrayInfoItem>
            <TrayInfoItem><strong>Plateau:</strong> {row}</TrayInfoItem>
          </TrayInfo>
          
          {/* Directement à la sélection du type d'œuf */}
          <div>
            <Label>Sélectionnez le type d'œuf:</Label>
            <TypeSelector>
              <TypeButton 
                selected={selectedType === 'chicken'} 
                onClick={() => setSelectedType('chicken')}
              >
                <TypeIcon selected={selectedType === 'chicken'} eggType='chicken'>
                  <GiChicken style={{ fontSize: '5rem', color: '#ff9900' }} />
                </TypeIcon>
                <TypeText selected={selectedType === 'chicken'} eggType='chicken'>
                  Poulet <small>(18 jours)</small>
                </TypeText>
              </TypeButton>
              
              <TypeButton 
                selected={selectedType === 'duck'} 
                onClick={() => setSelectedType('duck')}
              >
                <TypeIcon selected={selectedType === 'duck'} eggType='duck'>
                  <GiDuck style={{ fontSize: '5rem', color: '#0099cc' }} />
                </TypeIcon>
                <TypeText selected={selectedType === 'duck'} eggType='duck'>
                  Canard <small>(25 jours)</small>
                </TypeText>
              </TypeButton>
            </TypeSelector>
          </div>
          
          <OptionContainer style={{ marginTop: '20px' }}>
            <OptionButton onClick={() => handleAddTrayWithCurrentDate()}>
              <IconWrapper color="#28a745">
                <FaClock />
              </IconWrapper>
              Utiliser la date actuelle
            </OptionButton>
            
            <OptionButton onClick={() => setStep('calendar')}>
              <IconWrapper color="#007bff">
                <FaCalendarAlt />
              </IconWrapper>
              Choisir depuis le calendrier
            </OptionButton>
          </OptionContainer>
          
          <ButtonGroup>
            <CancelButton onClick={() => onClose()}>
              Annuler
            </CancelButton>
          </ButtonGroup>
        </>
      );
    }
  };
  
  // Render calendar view
  const renderCalendarView = () => (
    <>
      <TrayInfo>
        <TrayInfoItem><strong>Porte:</strong> {door === 'left' ? 'Gauche' : 'Droite'}</TrayInfoItem>
        <TrayInfoItem><strong>Plateau:</strong> {row}</TrayInfoItem>
      </TrayInfo>
      
      <DatePickerContainer>
        <Label>Sélectionner une date:</Label>
        <DatePickerWrapper>
          <StyledDatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            maxDate={new Date()}
            inline
          />
        </DatePickerWrapper>
      </DatePickerContainer>
      
      <ButtonGroup>
        <CancelButton onClick={() => setStep('initial')}>
          Retour
        </CancelButton>
        <AddButton onClick={handleAddTrayWithSelectedDate} disabled={loading}>
          <FaCheck /> Confirmer
        </AddButton>
      </ButtonGroup>
    </>
  );
  
  // Render confirm remove view
  const renderConfirmRemoveView = () => (
    <>
      <TrayInfo>
        <TrayInfoItem><strong>Porte:</strong> {door === 'left' ? 'Gauche' : 'Droite'}</TrayInfoItem>
        <TrayInfoItem><strong>Plateau:</strong> {row}</TrayInfoItem>
        <TrayInfoItem><strong>Type:</strong> {existingTray.eggType === 'duck' ? (
          <span><GiDuck style={{ verticalAlign: 'middle', marginRight: '5px', color: '#0099cc' }} /> Canard <small>(25 jours)</small></span>
        ) : (
          <span><GiChicken style={{ verticalAlign: 'middle', marginRight: '5px', color: '#ff9900' }} /> Poulet <small>(18 jours)</small></span>
        )}</TrayInfoItem>
        <TrayInfoItem><strong>Date d'ajout:</strong> {formatDate(existingTray.addedDate)}</TrayInfoItem>
        <TrayInfoItem><strong>Jours dans la couveuse:</strong> {calculateDaysInIncubator(existingTray.addedDate)}</TrayInfoItem>
      </TrayInfo>
      
      <ConfirmationContainer>
        <ConfirmationText>
          Êtes-vous sûr de vouloir retirer ce plateau?
        </ConfirmationText>
      </ConfirmationContainer>
      
      <ButtonGroup>
        <CancelButton onClick={() => setStep('initial')}>
          Annuler
        </CancelButton>
        <RemoveButton onClick={handleRemoveTray} disabled={loading}>
          <FaCheck /> Confirmer
        </RemoveButton>
      </ButtonGroup>
    </>
  );
  
  const Label = styled.label`
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  `;
  
  // Cette vue n'est plus nécessaire car le choix du type est maintenant directement dans la vue initiale
  // Gardée pour référence mais n'est plus utilisée
  const renderTypeSelectionView = () => (
    <>
      <TrayInfo>
        <TrayInfoItem><strong>Porte:</strong> {door === 'left' ? 'Gauche' : 'Droite'}</TrayInfoItem>
        <TrayInfoItem><strong>Plateau:</strong> {row}</TrayInfoItem>
      </TrayInfo>
      
      <div>
        <Label>Sélectionnez le type d'œuf:</Label>
        <TypeSelector>
          <TypeButton 
            selected={selectedType === 'chicken'} 
            onClick={() => setSelectedType('chicken')}
          >
            <TypeIcon selected={selectedType === 'chicken'} eggType='chicken'>
              <GiChicken style={{ fontSize: '5rem', color: '#ff9900' }} />
            </TypeIcon>
            <TypeText selected={selectedType === 'chicken'} eggType='chicken'>
              Poulet <small>(18 jours)</small>
            </TypeText>
          </TypeButton>
          
          <TypeButton 
            selected={selectedType === 'duck'} 
            onClick={() => setSelectedType('duck')}
          >
            <TypeIcon selected={selectedType === 'duck'} eggType='duck'>
              <GiDuck style={{ fontSize: '5rem', color: '#0099cc' }} />
            </TypeIcon>
            <TypeText selected={selectedType === 'duck'} eggType='duck'>
              Canard <small>(25 jours)</small>
            </TypeText>
          </TypeButton>
        </TypeSelector>
      </div>
      
      <ButtonGroup>
        <CancelButton onClick={() => setStep('initial')}>
          Retour
        </CancelButton>
        <AddButton onClick={handleAddTrayWithCurrentDate} disabled={loading}>
          <FaCheck /> Confirmer
        </AddButton>
      </ButtonGroup>
    </>
  );
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {existingTray ? 'Détails du plateau' : 'Ajouter un nouveau plateau'}
          </ModalTitle>
          <CloseButton onClick={() => onClose()}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        {error && <div style={{ color: '#dc3545', marginBottom: '15px' }}>{error}</div>}
        
        {step === 'initial' && renderInitialView()}
        {step === 'calendar' && renderCalendarView()}
        {step === 'confirm-remove' && renderConfirmRemoveView()}
        {/* La vue select-type n'est plus utilisée car intégrée dans la vue initiale */}
      </ModalContent>
    </ModalOverlay>
  );
};

export default TrayModal;
