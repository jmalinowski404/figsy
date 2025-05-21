import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet } from 'react-native';
import { Avatar, YStack, XStack, Button, Separator } from 'tamagui';
import pfp from '@/assets/images/legopfp1.jpg';
import { supabase } from '@/utils/supabase';
import { useEffect, useState } from "react";
import { StatsService } from '@/utils/stats';
import { getCurrentUserId } from "@/lib/auth";
import { router } from "expo-router";

export default function Tab({ userId: propUserId }: { userId: string }) {
    const [email, setEmail] = useState('');
    const [stats, setStats] = useState({
        total_collections: 0,
        unique_minifig_count: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Use a single source of truth for userId
    const [userId, setUserId] = useState<string>(propUserId || '');
    const [lastRefresh, setLastRefresh] = useState(Date.now());

    // If propUserId is provided, use it
    useEffect(() => {
        if (propUserId) {
            setUserId(propUserId);
        } else {
            // Otherwise fetch from auth
            const fetchUserId = async () => {
                try {
                    const id = await getCurrentUserId();
                    if (id) {
                        setUserId(id);
                    } else {
                        setError("Unable to retrieve user ID");
                    }
                } catch (err) {
                    console.error("Error fetching user ID:", err);
                    setError("Error retrieving user authentication");
                }
            };
            fetchUserId();
        }
    }, [propUserId]);
    
    useEffect(() => {
        const fetchEmail = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setEmail(user?.email || '');
        };
        fetchEmail();
    }, []);

    useEffect(() => {
        const loadStats = async () => {
            if (!userId) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            try {
                const statsData = await StatsService.getUserStats(userId);
                setStats(statsData);
            } catch (error) {
                console.error('Error loading stats:', error);
                setError("Failed to load user stats");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadStats();
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        const subscription = supabase
            .channel('profile_changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${userId}`
                },
                (payload) => {
                    setStats({
                        total_collections: payload.new.total_collections,
                        unique_minifig_count: payload.new.unique_minifigs_count
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [userId]);

    const handleRefresh = async () => {
        if (!userId) {
            setError("User ID is required for refresh");
            console.error("Refresh failed: User ID is required");
            return;
        }

        setLoading(true);
        try {
            const statsData = await StatsService.getUserStats(userId);
            setStats(statsData);
            setLastRefresh(Date.now());
            // Clear any previous errors when successful
            setError(null);
        } catch (err) {
            console.error('Refresh failed:', err);
            setError("Failed to refresh stats");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            router.replace('/(auth)/login')
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

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
                
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}
                
                <XStack style={styles.statsContainer}>
                    <YStack style={styles.statItem}>
                        <Text style={styles.number}>{stats.total_collections}</Text>
                        <Text style={styles.text}>Collections</Text>
                    </YStack>
                    
                    <Separator vertical style={styles.separator} />
                    
                    <YStack style={styles.statItem}>
                        <Text style={styles.number}>{stats.unique_minifig_count}</Text>
                        <Text style={styles.text}>Unique Minifigures</Text>
                    </YStack>
                </XStack>
                
                <Button 
                    onPress={handleRefresh} 
                    style={styles.refreshButton}
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
                
                <Text style={styles.lastRefresh}>
                    Last refresh: {new Date(lastRefresh).toLocaleString()}
                </Text>
                
                <Button 
                    style={styles.button} 
                    unstyled
                    onPress={handleLogout}
                >
                    Log Out
                </Button>
            </YStack>
        </SafeAreaView>
    );
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
    errorText: {
        marginTop: 12,
        color: '#cd4932',
        fontWeight: '500'
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
    refreshButton: {
        marginTop: 24,
        marginBottom: 8,
    },
    lastRefresh: {
        color: '#707070',
        fontSize: 14
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
});