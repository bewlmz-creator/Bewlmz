
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djgusfzesgyoxdewzfca.supabase.co';
const supabaseKey = 'sb_publishable_V895tkjUrtwcvKsyrWraMw_dLf15gs-';

export const supabase = createClient(supabaseUrl, supabaseKey);
