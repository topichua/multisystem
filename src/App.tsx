import { BrowserRouter as Router } from 'react-router-dom';
import AnalyticsTracker from 'src/components/common/AnalyticsTracker/AnalyticsTracker.tsx';
import { PageRoutes } from './pages/authorized/routes';
import 'overlayscrollbars/overlayscrollbars.css';
import 'normalize.css';

function App() {
  return (
    <Router>
      <AnalyticsTracker />
      <PageRoutes />
    </Router>
  );
}

export default App;
