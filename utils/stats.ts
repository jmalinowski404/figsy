import { supabase } from '@/utils/supabase'

export const StatsService = {
    async getUserStats(userId: string) {
        if (!userId) {
            throw new Error('User ID is required')
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('total_collections, unique_minifig_count')
            .eq('id', userId)
            .single()

        if (error) throw error
        return data
    },

    async refreshUserStats(userId: string) {
        const { data, error } = await supabase.rpc('update_user_stats_manually', {
            user_id: userId
        })

        if (error) throw error
        return data
    }
}