"use client"

import React from "react";
import { SupabaseProvider } from "@/context/SupabaseContext";
import { ModuleNamesProvider } from "@/context/ModuleNamesContext";

export default function Providers(props: { children: React.ReactNode }) {
    const { children } = props;
    return (
        <SupabaseProvider>
            <ModuleNamesProvider>
                {children}
            </ModuleNamesProvider>
        </SupabaseProvider>
    )
}