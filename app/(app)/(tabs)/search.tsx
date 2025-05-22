import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet } from 'react-native'
import SearchMinifigs from "@/components/SearchMinifigs";

export default function Tab() {
    return (
        <SafeAreaView style={styles.container}>
            <SearchMinifigs />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
    }
})