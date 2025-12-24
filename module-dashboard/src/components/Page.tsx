"use client"

// Imports
import { useState, useEffect, useContext } from 'react';
import { redirect } from 'next/navigation';
import dayjs, { Dayjs, UnitTypeLong } from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { FaPlus } from "react-icons/fa6";

// Styles
import styles from './Page.module.css';

// Components
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from './RightSidebar';

// Context
import { ModuleNamesContext } from '@/context/ModuleNamesContext';

// Util functions
import { getSemesterWeek } from '@/utils/getSemesterWeek';
import { getUrgencyColour } from '@/utils/getUrgencyColour';
import { getTasksDescendingUrgency } from '@/utils/getTasksDescendingUrgency';
import { getHrefFromString } from '@/utils/getHrefFromString';

// Types
import { SemesterWeek, TodoItem, ModuleTodoType, ModuleLinkType } from '@/types';

// Supabase import
import { useSupabase } from '@/context/SupabaseContext';
import { Session } from "@supabase/supabase-js";

export default function Page(props: any) {

    const { children } = props;

    // Get current week number
    const [semNum, setSemNum] = useState<number>(0);
    const [weekNum, setWeekNum] = useState<number>(0);
    useEffect(() => {
        let semData = getSemesterWeek();
        setSemNum(semData.semNum);
        setWeekNum(semData.weekNum);
    }, []);

    const [windowWidth, setWindowWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    useEffect(() => {
        setWindowWidth(window.innerWidth);

        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    const [leftSidebarWidth, setSidebarWidth] = useState(250);
    const [rightSidebarWidth, setSideContentWidth] = useState(250);

    const { modules, isLoading: isModuleNamesLoading } = useContext(ModuleNamesContext);

    const [moduleLinks, setModuleLinks] = useState<ModuleLinkType[]>([]);
    useEffect(() => {
        if (!isModuleNamesLoading) {
            // set modules as modulelink in sidebar
            let newLinks: ModuleLinkType[] = Object.entries(modules).map((mod: any, i: number): ModuleLinkType => {
                let [refName, { id, name }] = mod;
                return {
                    moduleId: id,
                    name: name,
                    href: `/module/${refName}`,
                }
            });

            // add home and settings to sidebar
            newLinks = [
                {
                    moduleId: '',
                    name: "Home Dashboard",
                    href: "/",
                },
                ...newLinks,
                {
                    moduleId: '',
                    name: "Settings",
                    href: "/settings",
                }
            ];

            setModuleLinks(newLinks);
        }
    }, [isModuleNamesLoading]);

    // Check Supabase Login
    const { supabase, session, loading } = useSupabase();
    console.log('SESSION: ', session);
    if (loading) {
        return <div>Loading ...</div>
    }

    if (!session) { // not logged in, redirect to Login page
        redirect("/login");
    }

    return (
        <div className={styles.page}>
            {/* Left Sidebar */}
            <LeftSidebar
                sidebarWidth={leftSidebarWidth}
                semNum={semNum}
                weekNum={weekNum}
                moduleLinks={moduleLinks} />

            {/* Interchangeable Main Content */}
            <div className={styles.mainContent}
                style={{
                    maxWidth: `${windowWidth - (leftSidebarWidth + 30) - rightSidebarWidth}px`,
                    marginLeft: `${leftSidebarWidth + 15}px`,
                }}>
                {children}
            </div>

            {/* Right Side Content */}
            <RightSidebar
                sidebarWidth={rightSidebarWidth} />
        </div>
    )
}