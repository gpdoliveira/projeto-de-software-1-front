import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Busca.css';

function BuscaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicamentos, setMedicamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // acordar o render
    fetch('https://trab-proj-softw-1-backend.onrender.com/ping/')
      .then(response => {
        if (!response.ok) throw new Error('Falha no ping');
        // quando acordar, busca os medicamentos
        return fetch('https://trab-proj-softw-1-backend.onrender.com/medications/api/');
      })
      .then(response => response.json())
      .then(data => {
        setMedicamentos(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao comunicar com a API:", error);
        setIsLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const resultados = useMemo(() => {
    return medicamentos.filter(med => {
      const termo = searchTerm.toLowerCase().trim();
      
      const nomeMed = med.name || '';
      const principioAtivo = med.generic_name || '';

      return !termo || 
             nomeMed.toLowerCase().includes(termo) || 
             principioAtivo.toLowerCase().includes(termo);
    });
  }, [searchTerm, medicamentos]);

  return (
    <div className="page">
      <div className="header">
        <div className="header-top">
          <div className="brand">
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
                <path d="M2 7h20"/>
                <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
              </svg>
            </div>
            <div className="brand-name">
              Farmácia Digital
            </div>
          </div>
        </div>

        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 18 18" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="7.5" cy="7.5" r="5"/>
            <line x1="11.5" y1="11.5" x2="16" y2="16"/>
          </svg>
          <input
            className="search-input"
            type="search"
            placeholder="Buscar por nome, princípio ativo…"
            value={searchTerm}
            onChange={handleInputChange}
            autoComplete="off"
            disabled={isLoading} 
          />
        </div>
      </div>

      {isLoading ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 20px', textAlign: 'center' }}>
          <style>
            {`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
          
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--green-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          
          <h2 style={{ color: 'var(--green-600)', fontSize: '18px', marginBottom: '8px' }}>Carregando...</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '14px', lineHeight: '1.5', maxWidth: '300px' }}>
            O primeiro acesso pode levar alguns segundos.
          </p>
        </div>
      ) : (
        <>
          <div className="results-meta">
            <span className="results-count">
              <strong>{resultados.length}</strong> medicamento{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
            </span>
            <button className="sort-btn">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <line x1="1" y1="4" x2="13" y2="4"/>
                <line x1="3" y1="7" x2="11" y2="7"/>
                <line x1="5" y1="10" x2="9" y2="10"/>
              </svg>
              Ordenar
            </button>
          </div>

          <div className="results-list">
            {resultados.length > 0 ? (
              resultados.map((med) => (
                <Link 
                  key={med.id}
                  to={`/medicamento/${med.id}`} 
                  className="med-card"
                >
                  <div className="med-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
                      <path d="m8.5 8.5 7 7"/>
                    </svg>
                  </div>
                  <div className="med-info">
                    <div className="med-name">
                      {med.name}
                    </div>
                    <div className="med-sub">
                      {med.generic_name || 'Princípio ativo não informado'} {med.concentration ? ` · ${med.concentration}` : ''}
                    </div>
                  </div>
                  {med.preco && <span className="med-price">R$ {med.preco}</span>}
                  <svg className="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 4l4 4-4 4"/>
                  </svg>
                </Link>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray-500)' }}>
                Nenhum medicamento encontrado para esta busca.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default BuscaPage;