import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { medicamentos } from '../../data/mockMedicamentos';
import styles from './Detalhes.module.css';

function DetalhesMedicamento() {
  const { id } = useParams(); 

  const medicamento = medicamentos.find(med => med.id === id);

  if (!medicamento) {
    return (
      <div className={styles.container}>
        <h2>Medicamento não encontrado!</h2>
        <Link to="/" className={styles.voltarBtn}>Voltar para a busca</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.voltarBtn}>&larr; Voltar</Link>
        <h1>Detalhes do Medicamento</h1>
      </header>

      <main className={styles.content}>
        <div className={styles.cardInfo}>
          <h2 className={styles.nome}>{medicamento.nome}</h2>
          
          <div className={styles.infoGroup}>
            <strong>Princípio Ativo:</strong>
            <p>{medicamento.principioAtivo}</p>
          </div>

          <div className={styles.infoGroup}>
            <strong>Apresentação:</strong>
            <p>{medicamento.apresentacao}</p>
          </div>

          <div className={styles.infoGroup}>
            <strong>Descrição:</strong>
            <p>{medicamento.descricao}</p>
          </div>

          <div className={styles.statusSection}>
            <h3>Disponibilidade</h3>
            <span className={medicamento.disponivel ? styles.statusOk : styles.statusOff}>
              {medicamento.disponivel ? 'Disponível para retirada' : 'Indisponível na rede'}
            </span>
            <p className={styles.local}><strong>Onde encontrar:</strong> {medicamento.unidadeSaude}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DetalhesMedicamento;