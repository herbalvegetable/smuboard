import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';

import styles from "./LeftSidebar.module.css";

import { ModuleLinkType } from '@/types';

export default function LeftSidebar(props: any) {

    const { sidebarWidth, semNum, weekNum, moduleLinks } = props;

    const router = useRouter();

    return (
        <div className={styles.sidebar}>
            <div className={styles.title}>
                <span>SMU Module Dashboard</span>
            </div>
            <div className={styles.modules}>
                {
                    moduleLinks.map((mod: ModuleLinkType, i: number) => {
                        const { moduleId, name, href } = mod;
                        return (
                            <Link key={i.toString()} 
                                href={href}>
                                <div className={styles.module}>
                                    <span>{name}</span>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>

            <div className={styles.weekTitle}>
                {
                    weekNum != -1 ?
                    <span>Week {weekNum}/14</span>
                    :
                    <span>End of Semester {semNum}!</span>
                }
                <span>{dayjs().format('ddd - D MMM YY')}</span>
            </div>
        </div>
    )
}