import { StatusBar } from 'expo-status-bar';
import { MainScreen } from './display/MainScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: 'white' }} >
      <StatusBar hidden />
      <MainScreen />
    </SafeAreaProvider>

  );
}

