import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from 'react-native'
import { Button, YStack } from 'tamagui'
import { Image } from 'expo-image';
import bkgImage from '@/assets/images/bkg.jpg'

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function LandingScreen() {

    function handleLogin() {

    }

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
                <Button color={'#FFFFFF'} size='$6' padding='$3' fontWeight='bold' style={styles.btnLog}>
                    Sign in
                </Button>
                <Button color={'#060602'} size='$6' padding='$3' fontWeight='bold' style={styles.btnReg}>
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