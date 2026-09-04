import { Alert, Platform } from 'react-native';

/**
 * `Alert.alert` nao faz nada no react-native-web, entao no navegador caimos
 * para o dialogo nativo do browser. Assim o mesmo codigo funciona nas 3 plataformas.
 */
export function showAlert(title: string, message?: string, onDismiss?: () => void) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    onDismiss?.();
    return;
  }

  Alert.alert(title, message, [{ text: 'OK', onPress: onDismiss }]);
}
