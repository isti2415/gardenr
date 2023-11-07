import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

const supabase = createPagesServerClient();

export default supabase;