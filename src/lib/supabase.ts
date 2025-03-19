/**
 * @module Supabase
 * @fileoverview Supabase client configuration and utilities
 * @since 1.0.0
 */

import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/**
 * Supabase client instance
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
