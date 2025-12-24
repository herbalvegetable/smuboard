import React, { createContext, useState, useEffect, useContext } from "react";
import { Session } from "@supabase/supabase-js";
import { createSBClient } from "@/utils/supabase/client";
import { useGoogleSession } from "@/hooks/useGoogleSession";

const supabase = createSBClient();

import { SupabaseContextType } from "@/types";
export const SupabaseContext = createContext<SupabaseContextType>({
    supabase: null,
    session: null,
    uuid: null,
    loading: true,
});


export const SupabaseProvider = (props: { children: React.ReactNode }) => {
    const { children } = props;

    const [session, setSession] = useState<Session | null>(null); // Or load from local storage/session
    const [uuid, setUuid] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUuid(session?.user.id ?? '');
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = () => {
        console.log("user sign out (session expired)");
        supabase.auth.signOut({ scope: "global" })
            .then((data: any) => {
                console.log(data);
            })
            .catch((err: any) => console.log("SUPABASE SIGNOUT ERROR: ", err));
    }

    useGoogleSession(session, handleLogout);

    return (
        <SupabaseContext.Provider value={{ supabase, session, uuid, loading }}>
            {children}
        </SupabaseContext.Provider>
    );
};

export const useSupabase = () => useContext(SupabaseContext);