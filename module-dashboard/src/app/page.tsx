"use client"

// Imports
import { useState, useEffect, useContext } from 'react';
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

// Styles
import styles from './page.module.css';
import 'react-responsive-modal/styles.css';

// Components
import { TodolistComponent } from '@/components';

// Context
import { ModuleNamesContext } from '@/context/ModuleNamesContext';

// Supabase import
import { useSupabase } from '@/context/SupabaseContext';

export default function Home() {
	const { uuid, supabase, session, loading } = useSupabase();

	const [todolists, setTodolists] = useState<any[]>([]);

	useEffect(() => {
		// fetch user's todolists
		fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/todolist?userId=${uuid}`)
			.then(res => res.json()
				.then(async data => {
					// set todolist raw data
					let todolists = data.data;
					setTodolists(todolists);
				}))
			.catch(err => console.log(err));
	}, []);

	return (
		<div className={styles.main}>
			<div className={styles.modules}>
				{
					todolists.map((tdlist: any, i: number) => {
						return <TodolistComponent key={i.toString()}
							id={tdlist.id}
							name={tdlist.module_name} />
					})
				}
			</div>
		</div>
	)
}