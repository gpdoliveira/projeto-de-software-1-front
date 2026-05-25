import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Detalhes.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function DetalhesPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [medicamento, setMedicamento] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`https://trab-proj-softw-1-backend.onrender.com/medications/api/${id}/`)
      .then(response => response.json())
      .then(data => {
        setMedicamento(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar detalhes:", error);
        setIsLoading(false);
      });
  }, [id]);

  const posicaoFarmacia = [-29.6842, -53.8069];

  if (isLoading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
         <strong style={{ color: 'var(--green-500)', fontSize: '18px' }}>Carregando informações...</strong>
         <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginTop: '8px' }}>Conectando ao banco de dados.</p>
      </div>
    );
  }

  if (!medicamento) {
    return (
      <div className="page" style={{ padding: '40px', textAlign: 'center' }}>
        <strong>Medicamento não encontrado.</strong>
        <button onClick={() => navigate(-1)} style={{ marginTop: '20px', padding: '10px 20px', background: 'var(--green-500)', color: 'white', border: 'none', borderRadius: '8px' }}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)} style={{ display: 'flex', marginBottom: '24px' }}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 12L6 8l4-4"/>
          </svg>
          Resultados
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="med-icon" style={{ marginBottom: 0, flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
              <path d="m8.5 8.5 7 7"/>
            </svg>
          </div>
          
          <div>
            <div className="header-name">{medicamento.name}</div>
            <div className="header-sub" style={{ marginTop: '2px' }}>{medicamento.concentration || 'Concentração não informada'}</div>
          </div>
        </div>
      </div>

      <div className="info-card">
        <div className="info-row">
          <div className="info-label">Princípio ativo</div>
          <div className="info-value">{medicamento.generic_name || 'Não informado'}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Concentração</div>
          <div className="info-value">{medicamento.concentration || 'Não informada'}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Descrição</div>
          <div className="info-desc">{medicamento.description || 'Sem descrição.'}</div>
        </div>
      </div>

      <div className="section-label">Localização da farmácia</div>
      <div className="map-block" style={{ height: '220px', borderRadius: '14px', margin: '0 16px', overflow: 'hidden' }}>
        <MapContainer center={posicaoFarmacia} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={posicaoFarmacia}>
            <Popup>
              <strong>Farmácia Municipal Central</strong> <br /> Medicamento disponível aqui.
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="section-label">Foto da farmácia</div>
      <div className="pharmacy-photo" style={{ position: 'relative', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=600" 
          alt="Fachada da Farmácia Municipal" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        <div className="photo-label" style={{ zIndex: 2 }}>
          <div>
            <div className="photo-label-text">Unidade Central</div>
            <div className="photo-label-addr">Atendimento das 08:00 às 17:00</div>
          </div>
        </div>
      </div>

      <div className="address-card">
        <div className="address-icon">
          <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
            <path d="M10 2C7.24 2 5 4.24 5 7c0 4.5 5 10 5 10s5-5.5 5-10c0-2.76-2.24-5-5-5z"/>
            <circle cx="10" cy="7" r="2"/>
          </svg>
        </div>
        <div>
          <div className="address-name">Farmácia Municipal Central</div>
          <div className="address-info">R. Cel. Niederauer</div>
        </div>
        <div className="open-badge">Aberto</div>
      </div>
    </div>
  );
}

export default DetalhesPage;