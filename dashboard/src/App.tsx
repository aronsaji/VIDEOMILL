import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import AutoSeries from './pages/AutoSeries';
import TrendAnalyzer from './pages/TrendAnalyzer';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Archive from './pages/Archive';
import Factory from './pages/Factory';
import Login from './pages/Login';
import Agents from './pages/Agents';

function App() {
  const { fetchInitialData, subscribeToChanges } = usePipelineStore();

  useEffect(() => {
    fetchInitialData();
    subscribeToChanges();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/factory" element={<Factory />} />
          <Route path="/auto-series" element={<AutoSeries />} />
          <Route path="/trends" element={<TrendAnalyzer />} />
          <Route path="/library" element={<Library />} />
          <Route path="/orders" element={<Archive />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

