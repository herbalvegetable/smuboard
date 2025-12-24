'use client';
import { useState, useEffect } from 'react';

// supabase npm
import { createSBClient } from '@/utils/supabase/client';
const supabase = createSBClient();

// supabase type
import { Session } from '@supabase/supabase-js';

export default function useSupabaseLogin(): Session | null {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        })
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })
        return () => subscription.unsubscribe()
    }, []);

    return session;
}