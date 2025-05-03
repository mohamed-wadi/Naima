import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllTrays, deleteTray, updateTray } from '../services/mockTraysService';
import { FaCheck, FaHourglass, FaExclamationTriangle, FaTimes, FaTrashAlt, FaFileExcel } from 'react-icons/fa';
import { GiChicken, GiDuck } from 'react-icons/gi';
import * as XLSX from 'xlsx';

// Définir l'URL de base pour les requêtes API
const API_URL = process.env.REACT_APP_API_URL || '/api';

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const HistoryTitle = styled.h2`
  margin-bottom: 20px;
  color: #343a40;
  text-align: center;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dee2e6;
`;

const Th = styled.th`
  padding: 12px 15px;
  text-align: left;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  font-weight: bold;
`;

const Td = styled.td`
  padding: 12px 15px;
  border: 1px solid #dee2e6;
  vertical-align: middle;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const TodayNote = styled.p`
  margin-top: 20px;
  font-style: italic;
  text-align: center;
`;

const DangerText = styled.span`
  color: #dc3545;
  font-weight: bold;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1rem;
  padding: 5px;
  transition: all 0.2s;
  
  &:hover {
    color: #c82333;
    transform: scale(1.1);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ClearHistoryButton = styled.button`
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: #f1b0b7;
  }
`;

const ExportButton = styled.button`
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: #b1dfbb;
  }
`;

const ConfirmationModal = styled.div`
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
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #343a40;
`;

const ModalText = styled.p`
  margin-bottom: 20px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ConfirmButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  
  &:hover {
    background-color: #c82333;
  }
`;

const CancelButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const History = () => {
  const [trays, setTrays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [trayToDelete, setTrayToDelete] = useState(null);
  const [confirmationMode, setConfirmationMode] = useState(''); // 'delete' ou 'clear'
  
  useEffect(() => {
    // Fetch all trays using mock service
    const fetchTrays = () => {
      setLoading(true);
      const allTrays = getAllTrays();
      setTrays(allTrays);
      setLoading(false);
    };
    
    fetchTrays();
    
    // Refresh data every minute to keep it updated
    const interval = setInterval(fetchTrays, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Filtre les plateaux en fonction du filtre sélectionné et supprime les données invalides
  const filteredTrays = trays.filter(tray => {
    // Vérifier que les propriétés nécessaires existent et sont valides
    const hasValidDate = tray.addedDate && !isNaN(new Date(tray.addedDate).getTime());
    const hasValidEggType = tray.eggType === 'chicken' || tray.eggType === 'duck';
    const hasValidDoor = tray.door && (tray.door === 'left' || tray.door === 'right');
    const hasValidRow = tray.row && !isNaN(tray.row);
    
    return hasValidDate && hasValidEggType && hasValidDoor && hasValidRow;
  });
  
  // Formatte la date pour l'affichage
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Formatte le jour de la semaine et la date ensemble sur une ligne
  const formatFullDate = (date) => {
    // Vérifier que la date est valide
    if (!date || isNaN(new Date(date).getTime())) {
      return 'Date invalide';
    }
    
    const weekday = new Date(date).toLocaleDateString('fr-FR', { weekday: 'long' });
    const monthYear = new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return `${weekday} ${monthYear}`;
  };
  
  // Calcule la date de complétion (18 jours pour poulet, 25 pour canard)
  const calculateCompletionDate = (addedDate, eggType = 'chicken') => {
    // Vérifier que la date est valide
    if (!addedDate || isNaN(new Date(addedDate).getTime())) {
      return new Date(); // Retourne la date actuelle en cas de date invalide
    }
    
    const added = new Date(addedDate);
    const completion = new Date(added);
    const incubationPeriod = eggType === 'duck' ? 25 : 18;
    completion.setDate(added.getDate() + incubationPeriod);
    return completion;
  };
  
  // Calcule les jours restants jusqu'à la complétion
  const calculateDaysRemaining = (addedDate, eggType = 'chicken') => {
    // Vérifier que la date est valide
    if (!addedDate || isNaN(new Date(addedDate).getTime())) {
      return 0; // Retourne 0 en cas de date invalide
    }
    
    const added = new Date(addedDate);
    const now = new Date();
    const completion = calculateCompletionDate(addedDate, eggType);
    const diffTime = Math.abs(completion - now);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Calcule les jours passés dans l'incubateur
  const calculateDaysInIncubator = (addedDate) => {
    // Vérifier que la date est valide
    if (!addedDate || isNaN(new Date(addedDate).getTime())) {
      return 0; // Retourne 0 en cas de date invalide
    }
    
    const added = new Date(addedDate);
    const now = new Date();
    const diffTime = Math.abs(now - added);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Récupère le côté de la porte en français
  const getDoorSide = (door) => {
    if (door === 'left') return 'Porte Gauche';
    if (door === 'right') return 'Porte Droite';
    return '';
  };
  
  // Récupère la date d'aujourd'hui au format français
  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long'
    });
  };
  
  // Récupère l'icône de statut en fonction du statut du plateau et des jours
  const getStatusIcon = (tray) => {
    const daysInIncubator = calculateDaysInIncubator(tray.addedDate);
    const incubationPeriod = tray.eggType === 'duck' ? 25 : 18;
    const warningThreshold = tray.eggType === 'duck' ? 23 : 16;
    
    if (tray.removed) {
      return <FaCheck style={{ color: '#28a745' }} />;
    } else if (daysInIncubator >= incubationPeriod) {
      return <FaExclamationTriangle style={{ color: '#dc3545' }} />;
    } else if (daysInIncubator >= warningThreshold) {
      return <FaExclamationTriangle style={{ color: '#ffc107' }} />;
    } else {
      return <FaHourglass style={{ color: '#17a2b8' }} />;
    }
  };
  
  // Récupère le texte de statut en fonction du statut du plateau et des jours
  const getStatusText = (tray) => {
    const daysInIncubator = calculateDaysInIncubator(tray.addedDate);
    const incubationPeriod = tray.eggType === 'duck' ? 25 : 18;
    const warningThreshold = tray.eggType === 'duck' ? 23 : 16;
    
    if (tray.removed) {
      return 'Retiré';
    } else if (daysInIncubator >= incubationPeriod) {
      return `Dépassé de ${daysInIncubator - incubationPeriod} jours`;
    } else if (daysInIncubator >= warningThreshold) {
      return 'Prêt à être retiré';
    } else {
      return 'En incubation';
    }
  };
  
  // Détermine si un plateau peut être supprimé (soit retiré, soit a dépassé le seuil d'alerte)
  const canDeleteTray = (tray) => {
    const warningThreshold = tray.eggType === 'duck' ? 23 : 16;
    return tray.removed || calculateDaysInIncubator(tray.addedDate) >= warningThreshold;
  };
  
  // Gérer la suppression d'un plateau
  const handleDeleteTray = (tray) => {
    setTrayToDelete(tray);
    setConfirmationMode('delete');
    setShowConfirmation(true);
  };
  
  // Confirmer la suppression d'un plateau
  const confirmDeleteTray = () => {
    if (trayToDelete) {
      deleteTray(trayToDelete._id);
      
      // Mettre à jour l'état local
      setTrays(trays.filter(t => t._id !== trayToDelete._id));
    }
    
    setShowConfirmation(false);
    setTrayToDelete(null);
  };
  
  // Gérer l'effacement de l'historique
  const handleClearHistory = () => {
    const hasOldTrays = trays.some(tray => canDeleteTray(tray));
    
    if (hasOldTrays) {
      setConfirmationMode('clear');
      setShowConfirmation(true);
    }
  };
  
  // Confirmer l'effacement de l'historique
  const confirmClearHistory = () => {
    // Supprimer tous les plateaux qui sont retirés ou qui ont dépassé le seuil d'alerte
    const traysToKeep = trays.filter(tray => !canDeleteTray(tray));
    const traysToDelete = trays.filter(tray => canDeleteTray(tray));
    
    // Supprimer les plateaux
    traysToDelete.forEach(tray => {
      deleteTray(tray._id);
    });
    
    // Mettre à jour l'état local
    setTrays(traysToKeep);
    
    setShowConfirmation(false);
  };
  
  // Annuler la confirmation
  const cancelConfirmation = () => {
    setShowConfirmation(false);
    setTrayToDelete(null);
  };
  
  // Exporter les données en Excel
  const exportToExcel = () => {
    // Création des données pour l'export
    const exportData = filteredTrays.map(tray => {
      const completionDate = calculateCompletionDate(tray.addedDate, tray.eggType);
      const daysRemaining = calculateDaysRemaining(tray.addedDate, tray.eggType);
      const daysInIncubator = calculateDaysInIncubator(tray.addedDate);
      const incubationPeriod = tray.eggType === 'duck' ? 25 : 18;
      const isOverdue = daysInIncubator >= incubationPeriod;
      
      return {
        "Porte": getDoorSide(tray.door) + (tray.removed ? ' (Retiré)' : ''),
        "N° Plateau": `Plateau ${tray.row}`,
        "Type": tray.eggType === 'duck' ? 'Canard' : 'Poulet',
        "Date d'ajout": formatFullDate(tray.addedDate),
        "Date de complétion": formatFullDate(completionDate),
        "Jours restants": tray.removed ? 'Retiré' : (isOverdue ? `Dépassé de ${daysInIncubator - incubationPeriod} jours` : `${daysRemaining} jours`),
        "Statut": tray.removed ? 'Retiré' : (isOverdue ? 'Dépassé' : 'En incubation'),
        "Notes": tray.notes || ''
      };
    });
    
    // Création du classeur Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Ajout de la feuille au classeur
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historique');
    
    // Générer le fichier Excel
    const date = new Date().toISOString().slice(0, 10);
    const fileName = `historique_plateaux_${date}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  
  return (
    <HistoryContainer>
      <HistoryTitle>Historique des plateaux</HistoryTitle>
      
      <TableContainer>
        <Table>
          <thead>
            <Tr>
              <Th>Porte</Th>
              <Th>N° Plateau</Th>
              <Th>Type</Th>
              <Th>Date d'ajout</Th>
              <Th>Date de complétion</Th>
              <Th>Jours restants</Th>
              <Th>Statut</Th>
              <Th>Action</Th>
            </Tr>
          </thead>
          <tbody>
            {loading ? (
              <Tr>
                <Td colSpan="7" style={{ textAlign: 'center' }}>Chargement en cours...</Td>
              </Tr>
            ) : filteredTrays.length === 0 ? (
              <Tr>
                <Td colSpan="7" style={{ textAlign: 'center' }}>Aucun plateau trouvé</Td>
              </Tr>
            ) : (
              filteredTrays.map(tray => {
                const completionDate = calculateCompletionDate(tray.addedDate, tray.eggType);
                const daysRemaining = calculateDaysRemaining(tray.addedDate, tray.eggType);
                const daysInIncubator = calculateDaysInIncubator(tray.addedDate);
                const incubationPeriod = tray.eggType === 'duck' ? 25 : 18;
                const isOverdue = daysInIncubator >= incubationPeriod;
                
                return (
                  <Tr key={tray._id}>
                    <Td>{getDoorSide(tray.door)} {tray.removed ? '(Retiré)' : ''}</Td>
                    <Td>Plateau {tray.row}</Td>
                    <Td>
                      {tray.eggType === 'duck' ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <GiDuck style={{ color: '#17a2b8' }} /> Canard
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <GiChicken style={{ color: '#ffc107' }} /> Poulet
                        </span>
                      )}
                    </Td>
                    <Td>{formatFullDate(tray.addedDate)}</Td>
                    <Td>{formatFullDate(completionDate)}</Td>
                    <Td>
                      {tray.removed ? (
                        'Retiré'
                      ) : isOverdue ? (
                        <DangerText>Dépassé de {daysInIncubator - incubationPeriod} jours</DangerText>
                      ) : (
                        `${daysRemaining} jours`
                      )}
                    </Td>
                    <Td>{getStatusIcon(tray)} {getStatusText(tray)}</Td>
                    <Td>
                      {canDeleteTray(tray) && (
                        <ActionButton 
                          onClick={() => handleDeleteTray(tray)}
                          title="Supprimer de l'historique"
                        >
                          <FaTimes />
                        </ActionButton>
                      )}
                    </Td>
                  </Tr>
                );
              })
            )}
          </tbody>
        </Table>
      </TableContainer>
      
      <ButtonsContainer>
        <ExportButton onClick={exportToExcel}>
          <FaFileExcel /> Exporter vers Excel
        </ExportButton>
        
        <ClearHistoryButton onClick={handleClearHistory}>
          <FaTrashAlt /> Effacer l'historique des éléments retirés
        </ClearHistoryButton>
      </ButtonsContainer>
      
      <TodayNote>Note: Aujourd'hui c'est le {getTodayDate()}</TodayNote>
      
      {showConfirmation && (
        <ConfirmationModal>
          <ModalContent>
            <ModalTitle>
              {confirmationMode === 'delete' ? 'Supprimer le plateau' : 'Effacer l\'historique'}
            </ModalTitle>
            <ModalText>
              {confirmationMode === 'delete' ? 
                'Êtes-vous sûr de vouloir supprimer ce plateau de l\'historique ?' : 
                'Êtes-vous sûr de vouloir effacer tous les plateaux retirés ou qui ont dépassé 16 jours de l\'historique ?'
              }
            </ModalText>
            <ModalButtons>
              <CancelButton onClick={cancelConfirmation}>Annuler</CancelButton>
              <ConfirmButton onClick={confirmationMode === 'delete' ? confirmDeleteTray : confirmClearHistory}>
                Confirmer
              </ConfirmButton>
            </ModalButtons>
          </ModalContent>
        </ConfirmationModal>
      )}
    </HistoryContainer>
  );
};

export default History;
