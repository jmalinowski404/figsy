import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet } from 'react-native'
import { Avatar, YStack, XStack, Button, Separator } from 'tamagui'
import pfp from '@/assets/images/legopfp1.jpg'
import { supabase } from '@/utils/supabase'
import { useEffect, useState } from "react";

export default function Tab() {
    const [email, setEmail] = useState('')
    
    useEffect(() => {
        const fetchEmail = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setEmail(user?.email || '')
        }
        fetchEmail()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <YStack style={styles.yStackMain}>
                <Avatar circular size="$11" style={styles.avatar}>
                    <Avatar.Image 
                        accessibilityLabel="Profile Picture"
                        src={pfp}
                    />
                    <Avatar.Fallback backgroundColor="#cd4932" />
                </Avatar>
                <Text style={styles.email}>{email}</Text>
                
                <XStack style={styles.statsContainer}>
                    <YStack style={styles.statItem}>
                        <Text style={styles.number}>3</Text>
                        <Text style={styles.text}>Collections</Text>
                    </YStack>
                    
                    <Separator vertical style={styles.separator} />
                    
                    <YStack style={styles.statItem}>
                        <Text style={styles.number}>28</Text>
                        <Text style={styles.text}>Unique Minifigures</Text>
                    </YStack>
                </XStack>
                
                <Button style={styles.button} unstyled>Log Out</Button>
            </YStack>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    yStackMain: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    avatar: {
        marginTop: 24
    },
    email: {
        fontSize: 24,
        fontWeight: '600',
        paddingTop: 20
    },
    statsContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 32,
        position: 'relative'
    },
    statItem: {
        flex: 1,
        gap: 4,
        alignItems: 'center'
    },
    separator: {
        position: 'absolute',
        left: '50%',
        top: 30,
        height: '110%',
        marginLeft: -1
    },
    number: {
        fontWeight: '600',
        fontSize: 26
    },
    text: {
        fontSize: 16,
        color: '#707070'
    },
    button: {
        marginTop: 40,
        width: '100%',
        backgroundColor: '#FFFFFF',
        color: '#cd4932',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 600,
        borderRadius: 8,
        borderColor: '#9a9a99',
        borderStyle: 'solid',
        borderWidth: 0.2,
        padding: 20
    }
})