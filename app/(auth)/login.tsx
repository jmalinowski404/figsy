import { View, Text, StyleSheet } from "react-native"
import { Button, Input, YStack } from 'tamagui'
import { SafeAreaView } from "react-native-safe-area-context"
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import { useState } from "react"
import { router } from 'expo-router'
import { supabase } from '@/utils/supabase'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cPassword, setCPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showCPassword, setShowCPassword] = useState(false)
    const [message, setMessage] = useState('')

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            setMessage(error.message)
            return
        }

        router.replace('/(tabs)' as never)
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View>
                <AntDesign name="left" size={24} color="black" onPress={() => router.back()} />
                <Text style={styles.heading}>
                    Sign In
                </Text>
                <YStack style={styles.inputContainer}>
                    <Input 
                        placeholder="Email address" 
                        size="$5" 
                        value={email} 
                        onChangeText={setEmail}
                        style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, }} 
                    />
                    <View style={{ display: 'flex', justifyContent: 'center' }}>
                        <Input 
                            placeholder="Password" 
                            size="$5" 
                            value={password} 
                            onChangeText={setPassword} 
                            secureTextEntry={!showPassword} 
                            autoCapitalize="none"
                            autoCorrect={false}
                            paddingRight="$10"
                            style={{ borderTopWidth: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, }}
                        />
                        <Button
                            position="absolute"
                            right="$3"
                            size="$2"
                            circular
                            icon={showPassword ? <Feather name="eye-off" size={24} color="black" /> : <Feather name="eye" size={24} color="black" />}
                            onPress={() => setShowPassword(!showPassword)}
                            chromeless
                            hoverStyle={{ opacity: 0.8 }}
                        />
                    </View>
                    
                </YStack>
                <View style={{ paddingTop: 32, paddingBottom: 32, display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', }}>
                    <Text style={{ fontSize: 16, fontWeight: 300 }}>Forgot password?</Text>
                </View>
                <View>
                    <Button
                        onPress={() => handleLogin()}
                        color={'#FFFFFF'} 
                        size='$6' 
                        padding='$3' 
                        fontWeight='bold'
                        style={styles.btnLog} 
                    >
                        Sign In
                    </Button>
                    {message && <Text>{message}</Text>}
                </View>
            </View>
            <View style={{ display: 'flex', width: '100%', flexDirection: 'column', paddingTop: '75%', gap: 15 }}>
                <Text style={{ width: '100%', textAlign: 'center', fontSize: 18, fontWeight: 300 }}>Don't have an account?</Text>
                <Text onPress={() => {router.push('/signup')}} style={{ width: '100%', textAlign: 'center', fontSize: 18, fontWeight: 300, color: '#cd4932' }}>Create account</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        boxSizing: 'border-box',
        paddingLeft: 20,
        paddingTop: 15,
        paddingRight: 20,
    },

    heading: {
        fontSize: 44,
        fontWeight: 600,
        paddingTop: 30,
    },

    inputContainer: {
        paddingTop: 24,
        display: 'flex',
        flexDirection: 'column',
    },

    btnLog: {
        backgroundColor: "#cd4932",
        width: '100%',
    },
})