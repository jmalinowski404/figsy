import { useEffect, useState } from 'react'
import { View, FlatList, Image, Text, ActivityIndicator, StyleSheet, TextInput } from 'react-native'
import { Button, Input, YStack } from 'tamagui'
import { useQuery } from '@tanstack/react-query'
import { RebrickableService } from '@/utils/rebrickable'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SearchMinifigs() {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery])

    const { data: minifigs, isLoading, error } = useQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: () => RebrickableService.searchMinifigs(debouncedQuery, 1, 20),
        enabled: debouncedQuery.length > 2, 
    })

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder='Search for a minifigure...'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                />

                {isLoading && <ActivityIndicator size="large" style={styles.loader}/>}

                {error && (
                    <Text style={styles.errorText}>
                        Search error: {error.message}
                    </Text>
                )}

                <FlatList
                    data={minifigs}
                    keyExtractor={(item) => item.set_num}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Image 
                                source={{ uri: item.set_img_url || 'https://via.placeholder.com/150' }}
                                style={styles.image}
                                resizeMode='contain'
                            />
                            <View>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.details}>{item.num_parts}</Text>
                                <Text style={styles.details}>{item.set_num}</Text>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        debouncedQuery.length > 2 && !isLoading ? (
                            <Text style={styles.emptyText}>No result for &quot;{debouncedQuery}&quot;</Text>
                        ) : null
                    }
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});