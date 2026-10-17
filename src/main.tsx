import { createRoot } from 'react-dom/client';
import '@fontsource/fredoka/latin-500.css';
import '@fontsource/bebas-neue/latin-400.css';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/chewy/latin-400.css';
import '@fontsource/dm-serif-display/latin-400.css';
import '@fontsource/patrick-hand/latin-400.css';
import './styles.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
