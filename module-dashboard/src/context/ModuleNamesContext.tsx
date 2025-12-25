"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

// Supabase import
import { useSupabase } from '@/context/SupabaseContext';
// utils
import { getHrefFromString } from '@/utils/getHrefFromString';

type ModuleNamesContextType = {
    modules: any;
    setModules: any;
    isLoading: boolean;
    fetchUserTodolists: (userId: string) => void;
}

export const ModuleNamesContext = createContext<ModuleNamesContextType>({
    modules: {},
    setModules: () => { },
    isLoading: true,
    fetchUserTodolists: () => { },
});

export const ModuleNamesProvider = (props: { children: React.ReactNode }) => {
    const { children } = props;
    const { uuid, loading } = useSupabase();

    // pull names from supabase user data
    const [modules, setModules] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchUserTodolists = (userId: string) => {
        setIsLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/todolist?userId=${userId}`)
            .then(res => res.json()
                .then(async data => {
                    console.log('FETCHED USER TODOLISTS', userId, data.data);
                    let todolists = data.data;

                    // init module names in context
                    const mods = Object.fromEntries(todolists.map((tdlist: any) => {
                        return [getHrefFromString(tdlist.module_name), {
                            id: tdlist.id,
                            name: tdlist.module_name,
                        }];
                    }));
                    setModules(mods);
                    setIsLoading(false);
                }))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        // fetch user's todolists
        if (!loading) {
            fetchUserTodolists(uuid!);
        }
    }, [loading]);

    return (
        <ModuleNamesContext.Provider value={{
            modules: modules,
            setModules: setModules,
            isLoading: isLoading,
            fetchUserTodolists: fetchUserTodolists,
        }}>
            {children}
        </ModuleNamesContext.Provider>
    )
}