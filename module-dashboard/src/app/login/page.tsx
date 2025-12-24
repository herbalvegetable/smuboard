"use client"
import { redirect } from 'next/navigation';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSupabase } from '@/context/SupabaseContext';

import styles from './page.module.css';

export default function LoginPage() {
    const { supabase, session, loading } = useSupabase();

    if (loading) {
        return <div>Loading ...</div>
    }

    if (session) {
        redirect("/");
    }

    async function googleSignIn() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                scopes: 'https://www.googleapis.com/auth/calendar',
            },
        });
        console.log("Error logging in with Google: ", error);
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>SMU Module Dashboard</h1>
            <button className={styles.googleSignin} 
                onClick={() => googleSignIn()}>
                Sign In With Google
            </button>
        </div>
    );
}