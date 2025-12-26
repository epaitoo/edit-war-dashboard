import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import './index.css';
import { AlertDetailPage } from './components/AlertDetailPage';
import { AlertsListPage } from './components/AlertsListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alerts" element={<AlertsListPage />} />
        <Route path="/alerts/:id" element={<AlertDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;