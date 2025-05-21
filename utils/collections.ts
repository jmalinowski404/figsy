// services/collections.ts
import { supabase } from './supabase';
import { StatsService } from './stats';

export const CollectionService = {
  async addMinifigToCollection(
    userId: string,
    collectionId: string,
    minifigId: string
  ) {
    const { data, error } = await supabase
      .from('collection_minifigs')
      .insert({
        collection_id: collectionId,
        minifig_id: minifigId
      })
      .select();

    if (error) throw error;

    // Wymuś aktualizację statystyk
    await StatsService.refreshUserStats(userId);
    
    return data;
  },

  async createCollection(userId: string, name: string, description?: string) {
    const { data, error } = await supabase
      .from('collections')
      .insert({
        user_id: userId,
        name,
        description
      })
      .select();

    if (error) throw error;

    // Wymuś aktualizację statystyk
    await StatsService.refreshUserStats(userId);
    
    return data;
  }
};