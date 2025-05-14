import { View, Text, ActivityIndicator } from 'react-native';
import { Button } from 'tamagui';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function WaitingConfirmation() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace('/');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Please confirm your email</Text>
      <Text style={{ marginBottom: 40, textAlign: 'center' }}>
        We have sent a confirmation link to your email address. 
        Click the link to verify your account.
      </Text>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 40, textAlign: 'center' }}>
        Press button below if it is not working.
      </Text>
      <Button 
        onPress={() => router.back()} 
        marginTop={20}
        theme="alt1"
      >
        Back to Sign Up
      </Button>
    </View>
  );
}