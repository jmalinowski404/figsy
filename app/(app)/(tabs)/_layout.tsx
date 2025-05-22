import { useFonts } from 'expo-font';
import { Slot, Stack, Tabs } from 'expo-router';
import 'react-native-reanimated';
import { StyleSheet } from 'react-native'
import { createTamagui,TamaguiProvider, View } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const config = createTamagui(defaultConfig)
const queryClient = new QueryClient()

export default function TabLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Tabs screenOptions={{ headerShown: false }}>
          <Tabs.Screen
            name='index'
            options={{
              tabBarIcon: ({ focused }) => <FontAwesome name="folder" size={24} color={focused ? "#cd4932" : "#9a9a99"} />,
              tabBarLabel: '',
            }}
          />
          <Tabs.Screen 
            name='search'
            options={{
              tabBarIcon: ({ focused }) => <FontAwesome name="search" size={24} color={focused ? "#cd4932" : "#9a9a99"} />,
              tabBarLabel: '', 
            }}
          />
          <Tabs.Screen
            name='profile'
            options={{
              tabBarIcon: ({ focused }) => <Ionicons name="person" size={24} color={focused ? "#cd4932" : "#9a9a99"} />,
              tabBarLabel: '',
            }}
          />
        </Tabs>
      </QueryClientProvider>
    </TamaguiProvider>
    
  );
}