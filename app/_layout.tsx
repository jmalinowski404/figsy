import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import 'react-native-reanimated';

import { createTamagui,TamaguiProvider, View } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

import { useColorScheme } from '@/hooks/useColorScheme';

const config = createTamagui(defaultConfig)

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Stack screenOptions={{ headerShown: false }}>
        <Slot />
      </Stack>
    </TamaguiProvider>
    
  );
}
