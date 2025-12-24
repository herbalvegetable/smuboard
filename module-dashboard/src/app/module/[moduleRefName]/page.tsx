"use client"
import React, { useState, useEffect, useContext } from 'react';

import styles from './page.module.css'

// components
import { Page, TodolistComponent } from '@/components';

// context
import { ModuleNamesContext } from '@/context/ModuleNamesContext';

interface UserPageProps {
    params: {
        moduleRefName: string;
    };
}

export default function Module({ params }: UserPageProps) {
    const { moduleRefName } = React.use(params as any) as any;
    const { modules, isLoading } = useContext(ModuleNamesContext);

    useEffect(() => {
        console.log("moduleName: ", moduleRefName);
        console.log(`ISLOADING: ${isLoading} | Module ID: `, modules, moduleRefName, modules[moduleRefName]);
    }, [isLoading]);

    if (isLoading) {
        return <div>Loading {moduleRefName}...</div>
    }
    else {
        return (
            // <div>loading</div>
            <div className={styles.container}>
                <TodolistComponent id={modules[moduleRefName].id} name={modules[moduleRefName].name} />
            </div>
        )
    }
}