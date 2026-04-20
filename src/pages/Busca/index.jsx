import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import styles from './Busca.module.css';
import { medicamentos } from '../../data/mockMedicamentos';

const PillIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5 21C8.01 21 6 18.99 6 16.5C6 14.01 8.01 12 10.5 12C12.99 12 15 14.01 15 16.5C15 18.99 12.99 21 10.5 21Z" fill="#FFF" fillOpacity="0.8"/>
    <path d="M17.5 13C15.01 13 13 10.99 13 8.5C13 6.01 15.01 4 17.5 4C19.99 4 22 6.01 22 8.5C22 10.99 19.99 13 17.5 13Z" fill="#FFF" fillOpacity="0.8"/>
    <rect x="2" y="10" width="10" height="4" rx="2" fill="none" stroke="#FFF" strokeWidth="2"/>
    <rect x="12" y="6" width="10" height="4" rx="2" fill="none" stroke="#FFF" strokeWidth="2"/>
  </svg>
);

const SearchIcon = ({ color = "#6b7280", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

function BuscaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resultados, setResultados] = useState([]); 
  const [buscou, setBuscou] = useState(false); 

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setBuscou(false);
      setResultados([]);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      const filtrados = medicamentos.filter(med => 
        med.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResultados(filtrados);
      setBuscou(true);
    }
  };

  return (
    <div className={styles.buscaPage}>
      <header className={styles.buscaHeader}>
        <div className={styles.buscaLogoSection}>
          <div className={styles.buscaTitles}>
            <h1 className={styles.buscaTitle}>Farmácia</h1>
            <p className={styles.buscaSubtitle}>Encontre medicamentos disponíveis na rede pública</p>
          </div>
        </div>
        
        <div className={styles.searchBarContainer}>
          <div className={styles.searchBarInputGroup}>
            <div className={styles.searchIconWrapper}>
                <SearchIcon color="#FFF" />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Digite o nome do medicamento..."
              className={styles.searchInput}
            />
          </div>
          <button onClick={handleSearch} className={styles.searchButton}>
            Buscar
          </button>
        </div>
      </header>

      <main className={styles.buscaMainContent}>
        {!buscou ? (
            <div className={styles.initialState}>
                <div className={styles.bigIconCircle}>
                    <SearchIcon color="#008767" size={48} />
                </div>
                <h2 className={styles.initialTitle}>Procure por um medicamento</h2>
                <p className={styles.initialSubtitle}>
                    Digite o nome do medicamento na barra de busca acima
                </p>
            </div>
        ) : (
            <div className={styles.resultsContainer}>
                <h3 className={styles.resultsHeader}>Resultados para "{searchTerm}"</h3>
                
                {resultados.length === 0 ? (
                  <p className={styles.noResults}>Nenhum medicamento encontrado.</p>
                ) : (
                  <div className={styles.cardsGrid}>
                    {resultados.map((med) => (
                      <div key={med.id} className={styles.medCard}>
                        <h4 className={styles.medName}>{med.nome}</h4>
                        <span className={med.disponivel ? styles.tagDisponivel : styles.tagIndisponivel}>
                          {med.disponivel ? 'Disponível' : 'Indisponível'}
                        </span>
                        <p className={styles.medInfo}>{med.principioAtivo}</p>
                        <Link to={`/medicamento/${med.id}`} className={styles.detailsButton}>
                          Ver Detalhes
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
}

export default BuscaPage;