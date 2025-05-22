import { supabase } from '@/utils/supabase'

const REBRICKABLE_API_KEY = '7638f171ec8b95f97e6f321eb4a8b330'
const REBRICKABLE_API_URL = 'https://rebrickable.com/api/v3/lego'

interface Minifig {
    set_num: string
    name: string
    num_parts: number
    set_img_url: string | null
    set_url: string
    last_modified_at: string
}

export const RebrickableService = {
    async searchMinifigs(
        query: string,
        page: number = 1,
        pageSize: number = 20
    ): Promise<{ results: Minifig[]; count: number }> {
        try {
            const { data: cachedResults, error: cacheError } = await supabase
                .from('minifigs')
                .select('*')
                .or(`search_keywords.ilike.%${query}%,set_num.ilike.%${query}%`)
                .range((page - 1) * pageSize, page * pageSize - 1)

            if (cachedResults && cachedResults.length > 0) {
                return {
                    results: cachedResults,
                    count: cachedResults.length,
                }
            }

            const response = await fetch(
                `${REBRICKABLE_API_URL}/minifigs/?search=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`, 
                {
                    method: 'GET',
                    headers: {
                    Authorization: `key ${REBRICKABLE_API_KEY}`,
                    },
                }
            );

            console.log('Status: ', response.status)
            
            if (!response.ok) {
                const errorBody = await response.text()
                console.error('Rebrickable API full response: ', response.status, errorBody)
                throw new Error(`Rebrickable API error: ${response.statusText}`)
            }

            const data = await response.json()
            const results: Minifig[] = data.results

            return {
                results,
                count: data.count,
            }
        } catch (error) {
            console.error('Error searching minfigs: ', error)
            throw error
        }
    },

    async getMinifigDetails(setNum: string): Promise<Minifig> {
        try {
            const { data: cachedData, error: cacheError } = await supabase
                .from('minifigs')
                .select('*')
                .eq('set_num', setNum)
                .single()

            if (cachedData) {
                return cachedData
            }

            const response = await fetch(`${REBRICKABLE_API_URL}/minifigs/${setNum}/`, {
                headers: {
                    Authorization: `key ${REBRICKABLE_API_KEY}`,
                },
            })

            if (!response.ok) {
                throw new Error(`Rebrickable API error: ${response.statusText}`)
            }

            const minifigData: Minifig = await response.json()

            await this.cacheMinifig(minifigData)

            return minifigData
        } catch (error) {
            console.error('Error fetching minifig details: ', error)
            throw error
        }
    },

    async cacheMinifig(minifigData: Minifig): Promise<void> {
        try {
            const { error } = await supabase.from('minifigs').upsert(
                {
                    set_num: minifigData.set_num,
                    name: minifigData.name,
                    num_parts: minifigData.num_parts,
                    set_img_url: minifigData.set_img_url,
                    set_url: minifigData.set_url,
                    last_modified: minifigData.last_modified_at,
                    search_keywords: `${minifigData.name.toLowerCase()} ${minifigData.set_num.toLowerCase()}`,
                },
                { onConflict: 'set_num' }
            )

            if (error) throw error
        } catch (error) {
            console.error('Error caching minifig: ', error)
            throw error
        }
    },

    async cacheMinifigs(minifigs: Minifig[]): Promise<void> {
        try {
            const minifigsToInsert = minifigs.map((minifig) => ({
                set_num: minifig.set_num,
                name: minifig.name,
                num_parts: minifig.num_parts,
                set_img_url: minifig.set_img_url,
                set_url: minifig.set_url,
                last_modified: minifig.last_modified_at,
                search_keywords: `${minifig.name.toLowerCase()} ${minifig.set_num.toLowerCase()}`,
            }))

            const { error } = await supabase
                .from('minifigs')
                .upsert(minifigsToInsert, { onConflict: 'set_num' })

            if (error) throw error
        } catch (error) {
            console.error('Error caching multiple minifigs: ', error)
            throw error
        }
    },

    async getRandomMinifigs(count = 5): Promise<Minifig[]> {
        try {
      
        const { data: cachedData, error: cacheError } = await supabase
            .rpc('get_random_minifigs', { count });

        if (cachedData) {
            return cachedData;
        }

        const response = await fetch(
            `${REBRICKABLE_API_URL}/minifigs/?page_size=${count}`,
            {
            headers: {
                Authorization: `key ${REBRICKABLE_API_KEY}`,
            },
            }
        );

        if (!response.ok) {
            throw new Error(`Rebrickable API error: ${response.statusText}`);
        }

        const data = await response.json();
        const results: Minifig[] = data.results;

        await this.cacheMinifigs(results);

        return results;
        } catch (error) {
            console.error('Error getting random minifigs:', error);
            throw error;
        }
    },
}