import './graphics/styles/styles.scss';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Main from './pages/main/Main'
import Events from './pages/calendar/Events'
import Menu from './components/menu/Menu';
import Options from './pages/options/Options';
function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/calendar" element={<Events />} />
          <Route path="/options" element={<Options />} />
        </Routes>
        <Menu />
      </div>
    </Router>
  );
}

export default App;