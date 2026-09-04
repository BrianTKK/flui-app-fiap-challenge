import { Linking, Platform } from 'react-native';
import { showAlert } from './alert';

interface Destination {
  latitude: number;
  longitude: number;
}

/**
 * Abre a rota ate a estacao. Tenta Waze e depois Google Maps no dispositivo;
 * se nenhum estiver instalado (ou no navegador) cai para o Google Maps web.
 */
export async function openDirections({ latitude, longitude }: Destination) {
  const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  try {
    if (Platform.OS !== 'web') {
      const appUrls = [
        `waze://?ll=${latitude},${longitude}&navigate=yes`,
        `google.navigation:q=${latitude},${longitude}`,
      ];

      for (const url of appUrls) {
        if (await Linking.canOpenURL(url)) {
          await Linking.openURL(url);
          return;
        }
      }
    }

    await Linking.openURL(webUrl);
  } catch {
    showAlert(
      'Navegação',
      'Não foi possível abrir o app de navegação. Verifique se o Waze ou o Google Maps está instalado.'
    );
  }
}
