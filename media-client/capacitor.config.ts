import { CapacitorConfig } from '@capacitor/cli';
import { environment } from './src/environments/environment';

const config: CapacitorConfig = {
  appId: 'com.johnnyflix.app',
  appName: 'JohnnyFlix',
  webDir: 'dist/johnnyflix-mobile/browser',
  server: {
    androidScheme: 'http',
    cleartext: true,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
