import { useState } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { bankThemes } from './theme/Bankthemes';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/Home';
import './theme/theme.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthenticationPage } from './pages/Authentication';
import { ResultPage } from './pages/Result';

export default function App() {
  // In production, sourceid comes from POST /session/init, not a dropdown.
  // This switcher exists purely to demonstrate — and let you manually
  // verify — that the whole app re-themes the instant sourceid changes.
  const [sourceid, setSourceid] = useState('HDFC'); // default to HDFC, matches reference screenshot

  return (
    <BrowserRouter>
      <ThemeProvider sourceid={sourceid}>
        <div className="dev-switcher">
          <label>
            Preview as bank:{' '}
            <select value={sourceid} onChange={(e) => setSourceid(e.target.value)}>
              {Object.values(bankThemes).map((bank) => (
                <option key={bank.sourceid} value={bank.sourceid}>
                  {bank.bankName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/acs" element={<AuthenticationPage />} />
          <Route path ="/result" element={<ResultPage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>

  );
}