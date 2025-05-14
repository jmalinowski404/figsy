import { SafeAreaView } from "react-native-safe-area-context"
import { StyleSheet, View } from 'react-native'
import { Button, YStack } from 'tamagui'
import { Image } from 'expo-image'
import { Link, router } from 'expo-router'
import bkgImage from '@/assets/images/bkg.jpg'
import { useEffect } from "react"
import { supabase } from "@/utils/supabase"

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function LandingScreen() {
    useEffect(() => {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          router.replace('/(tabs)' as never);
        }
      });

      return () => authListener.subscription.unsubscribe();
    }, []);

    const goToLogin = () => router.push('/login')
    const goToSignup = () => router.push('/signup')

    return (
        <SafeAreaView style={styles.container}>
            <Image 
                style={styles.bkgImage}
                source={bkgImage}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
            />
            <View style={styles.overlay} />
            <YStack style={styles.ystack}>
                <Button 
                  onPress={goToLogin}
                  color={'#FFFFFF'} 
                  size='$6' 
                  padding='$3' 
                  fontWeight='bold' 
                  style={styles.btnLog} 
                  href="/login"
                >
                    Sign in
                </Button>

                <Button 
                  onPress={goToSignup}
                  color={'#060602'} 
                  size='$6' 
                  padding='$3' 
                  fontWeight='bold' 
                  style={styles.btnReg} 
                  href="signup"
                >
                    Create Account
                </Button>
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },

  bkgImage: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },

  btnLog: {
    backgroundColor: "#cd4932",
    width: '80%',
  },

  btnReg: {
    backgroundColor: "#FFFFFF",
    width: '80%',
  },

  ystack: {
    position: 'absolute',
    top: 450,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  }
});