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
  
  const [selectedFarmIndex, setSelectedFarmIndex] = useState(0);

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

  const farmacias = medicamento.farmacias || [];
  const hasFarmacias = farmacias.length > 0;
  const hasMultiple = farmacias.length > 1;
  const farmaciaAtiva = hasFarmacias ? farmacias[selectedFarmIndex] : null;

  const cids = medicamento.cids || [];
  const documentos = medicamento.documentos || [];

  const posicaoFarmacia = farmaciaAtiva && farmaciaAtiva.latitude && farmaciaAtiva.longitude
    ? [parseFloat(farmaciaAtiva.latitude), parseFloat(farmaciaAtiva.longitude)]
    : [-29.6842, -53.8069];

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
            <div className="header-name">{medicamento.nome}</div>
            <div className="header-sub" style={{ marginTop: '2px' }}>{medicamento.apresentacao || 'Apresentação não informada'}</div>
          </div>
        </div>
      </div>

      <div className="info-card">
        <div className="info-row">
          <div className="info-label">Princípio ativo</div>
          <div className="info-value">{medicamento.principioAtivo || 'Não informado'}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Apresentação</div>
          <div className="info-value">{medicamento.apresentacao || 'Não informada'}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Descrição</div>
          <div className="info-desc">{medicamento.descricao || 'Nenhuma descrição fornecida pelo sistema.'}</div>
        </div>
      </div>

      {cids.length > 0 && (
        <>
          <div className="section-label">Indicações (CIDs)</div>
          <div className="info-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cids.map(cid => (
              <div key={`cid-${cid.id}`} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 700, color: 'var(--green-600)', minWidth: '45px', fontSize: '14px' }}>
                  {cid.code}
                </span>
                <span style={{ color: 'var(--gray-700)', fontSize: '14px', lineHeight: '1.3' }}>
                  {cid.name}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {documentos.length > 0 && (
        <>
          <div className="section-label" style={{ paddingTop: cids.length > 0 ? '8px' : '20px' }}>
            Documentos Exigidos
          </div>
          <div className="info-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {documentos.map(doc => (
              <div key={`doc-${doc.id}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-400)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'var(--gray-700)', fontSize: '14px', lineHeight: '1.3', fontWeight: 500 }}>
                    {doc.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {hasMultiple && (
        <>
          <div className="section-label" style={{ paddingTop: '24px', paddingBottom: '12px' }}>
            Disponível nas unidades abaixo
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '0 16px' }}>
            {farmacias.map((farm, index) => {
              const isSelected = selectedFarmIndex === index;
              return (
                <button
                  key={`btn-${farm.id}`}
                  onClick={() => setSelectedFarmIndex(index)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isSelected ? 'var(--green-50)' : 'white',
                    border: isSelected ? '2px solid var(--green-500)' : '1px solid var(--green-200)',
                    color: isSelected ? 'var(--green-600)' : 'var(--gray-700)',
                    fontWeight: isSelected ? 700 : 600,
                  }}
                >
                  <span style={{ flex: 1, paddingRight: '12px', lineHeight: '1.4' }}>
                    {farm.name}
                  </span>
                  
                  {isSelected && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {farmaciaAtiva ? (
        <div style={{ marginBottom: '32px' }}>
          <div className="section-label" style={{ paddingTop: hasMultiple ? '24px' : '20px' }}>
            Localização da farmácia {hasMultiple ? 'selecionada' : ''}
          </div>
          
          <div className="map-block" key={`map-${farmaciaAtiva.id}`} style={{ height: '220px', borderRadius: '14px', margin: '0 16px', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
            <MapContainer center={posicaoFarmacia} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={posicaoFarmacia}>
                <Popup>
                  <strong>{farmaciaAtiva.name}</strong> <br /> Medicamento disponível aqui.
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="section-label">Foto da farmácia</div>
          <div className="pharmacy-photo" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#eef1ee' }}>
            {farmaciaAtiva.image ? (
              <img 
                src={farmaciaAtiva.image} 
                alt={`Fachada da ${farmaciaAtiva.name}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5d6a7', fontWeight: 600 }}>
                Sem foto disponível
              </div>
            )}

            <div className="photo-label" style={{ zIndex: 2 }}>
              <div>
                <div className="photo-label-text">{farmaciaAtiva.name}</div>
                <div className="photo-label-addr">
                  {farmaciaAtiva.description ? 'Ver horário de atendimento' : 'Atendimento no local'}
                </div>
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
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="address-name" style={{ lineHeight: '1.3' }}>
                {farmaciaAtiva.name}
              </div>
              <div className="address-info">{farmaciaAtiva.address}</div>
              {farmaciaAtiva.phone && (
                <div className="address-info" style={{ marginTop: '2px', fontWeight: 600, color: 'var(--green-500)' }}>
                  📞 {farmaciaAtiva.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--gray-500)' }}>
          Nenhuma farmácia informada para este medicamento.
        </div>
      )}
      
      <div style={{ height: '32px' }}></div> 
    </div>
  );
}

export default DetalhesPage;