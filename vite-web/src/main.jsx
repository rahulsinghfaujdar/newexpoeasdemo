import { createRoot } from 'react-dom/client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from '../../src/app/app';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>,
);
