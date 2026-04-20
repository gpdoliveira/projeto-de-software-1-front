import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BuscaPage from './pages/Busca';
import DetalhesMedicamento from './pages/DetalhesMedicamento';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BuscaPage />} />
        <Route path="/medicamento/:id" element={<DetalhesMedicamento />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;