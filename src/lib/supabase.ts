// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DBConfiguration {
  id: string;
  user_id: string;
  name: string;
  config_json: string;
  validation_json: string;
  created_at: string;
  updated_at: string;
}

// Helper functions
export async function saveConfiguration(
  userId: string,
  name: string,
  config: object,
  validation: object
) {
  const { data, error } = await supabase
    .from('configurations')
    .insert({
      user_id: userId,
      name,
      config_json: JSON.stringify(config),
      validation_json: JSON.stringify(validation),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function loadConfigurations(userId: string) {
  const { data, error } = await supabase
    .from('configurations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteConfiguration(id: string) {
  const { error } = await supabase
    .from('configurations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
