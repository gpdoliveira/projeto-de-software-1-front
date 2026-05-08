import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { medicamentos } from '../../data/mockMedicamentos';
import styles from './Detalhes.module.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// sugestao do gemini p corrigir o icone
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

function DetalhesMedicamento() {
  const { id } = useParams(); 

  const medicamento = medicamentos.find(med => med.id == id);

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

            {medicamento.localizacao && (
              <div style={{ height: '300px', width: '100%', marginTop: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd' }}>
                <MapContainer 
                  center={[medicamento.localizacao.lat, medicamento.localizacao.lng]} 
                  zoom={15} 
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[medicamento.localizacao.lat, medicamento.localizacao.lng]}>
                    <Popup>
                      {medicamento.unidadeSaude}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DetalhesMedicamento;