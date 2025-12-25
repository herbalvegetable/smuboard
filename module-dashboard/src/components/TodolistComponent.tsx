// Imports
import { useState, useEffect, useContext } from 'react';
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { FaPlus } from "react-icons/fa6";
import { Modal, Box, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Styles
import styles from './TodolistComponent.module.css';
import 'react-responsive-modal/styles.css';

// Components
import TodoItemComponent from '@/components/TodoItemComponent';

// Types
import { TodoItem, ModuleTodoType } from '@/types';

type ItemDataType = {
	summary: string;
	datetime: string;
}

function AddItemModal(props: any) {
	const { open, onClose, moduleName, moduleId, refreshItems } = props;

	const [itemData, setItemData] = useState<ItemDataType>({
		summary: '',
		datetime: dayjs().add(1, "day").format("YYYY-MM-DD HH:mm:ss"),
	});

	const handleSubmit = () => {
		if(itemData.summary === ''){
			console.log('Summary is empty');
			return;
		}

		handleSubmitTodoItem(itemData.summary, itemData.datetime, moduleId);
		// close modal
		onClose();
	}

	const handleSubmitTodoItem = (summary: string, deadlineDate: string, todolistId: number) => {
		console.log('submit todoitem for ', moduleName);
		// Create todo item
		let data = { summary, deadlineDate, todolistId };

		fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/todoitem`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})
			.then(res => res.json()
				.then(data => {
					console.log('REQUEST SUCCESS: Created todo item', data.data);

					// clear user inputs
					setItemData({
						summary: '',
						datetime: dayjs().add(1, "day").format("YYYY-MM-DD HH:mm:ss"),
					});

					// refresh todoitems
					refreshItems();
				}))
			.catch(err => console.log(err));
	}

	const customTheme = createTheme({
		typography: {
			fontFamily: 'Lexend, sans-serif',
		},
	});

	return (
		<Modal
			open={open}
			onClose={onClose}>
			<Box className={styles.itemModal}>
				<span className={styles.title}>Add Item for {moduleName}</span>
				<ThemeProvider theme={customTheme}>
					<TextField
						label="Summary"
						variant="standard"
						multiline
						minRows={1}
						maxRows={15}
						value={itemData.summary}
						onChange={e => {
							let newItemData = { ...itemData };
							newItemData.summary = e.target.value;
							setItemData(newItemData);
						}}
						fullWidth />
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DemoContainer components={['DatePicker']}>
							<DatePicker
								label="Due Date"
								format="DD/MM/YYYY"
								value={dayjs(itemData.datetime, "YYYY-MM-DD HH:mm:ss")}
								onChange={(newValue: Dayjs | null) => {
									let newItemData = { ...itemData };
									newItemData.datetime = newValue?.format("YYYY-MM-DD HH:mm:ss") ?? dayjs().format("YYYY-MM-DD HH:mm:ss");
									setItemData(newItemData);
								}} />
						</DemoContainer>
					</LocalizationProvider>
				</ThemeProvider>
				<button className={styles.submitBtn}
					onClick={e => handleSubmit()}>
					Add Item
				</button>
			</Box>
		</Modal>
	)
}

export default function TodolistComponent(props: any) {
	const { id, name } = props;

	const [todolist, setTodolist] = useState<ModuleTodoType | null>(null);

	const fetchTodoitemsForList = async (todolistId: number) => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/todoitem?todolistId=${todolistId}`);
			const { data } = await res.json();
			return data;
		}
		catch (err) {
			console.log(err);
			throw err;
		}
	}

	const convertTodoitemsData = (todoitemsData: any): TodoItem[] => {
		return todoitemsData.map((itemData: any, i: number): TodoItem => {
			return {
				id: itemData.id,
				moduleName: name,
				description: itemData.summary,
				datetime: dayjs(itemData.deadline_date).format("YYYY-MM-DD HH:mm:ss"),
			}
		});
	}

	// init todolist
	const initTodolist = async () => {
		// fetch todo items
		let todoitemsData: any;
		try {
			todoitemsData = await fetchTodoitemsForList(id);
		}
		catch (err) {
			console.log(`Error fetching todoitems for ${name}`, err);
		}

		// init todoitems
		let todoitems: TodoItem[] = convertTodoitemsData(todoitemsData);

		// init todolist
		let todolist: ModuleTodoType = {
			id: id,
			name: name,
			items: todoitems,
		}
		setTodolist(todolist);
	}
	useEffect(() => {
		initTodolist();
	}, []);

	const [openModal, setOpenModal] = useState(false);

	const onOpenModal = () => {
		setOpenModal(true);
	}

	const onCloseModal = () => {
		setOpenModal(false);
	}

	const refreshItems = async () => {
		console.log(`refresh items for ${name}`);
		// fetch todo items
		let todoitemsData: any;
		try {
			todoitemsData = await fetchTodoitemsForList(id);
		}
		catch (err) {
			console.log(`Error fetching todoitems for ${name}`, err);
		}

		let newTodolist: ModuleTodoType = {
			id: todolist?.id ?? 0,
			name: todolist?.name ?? '',
			items: convertTodoitemsData(todoitemsData),
		}
		setTodolist(newTodolist);
	}

	if (todolist === null) {
		return (
			<div className={styles.module}>
				<span>Loading {name}...</span>
			</div>
		)
	}

	return (
		<div className={styles.module}>

			<div className={styles.title}>
				<span>{todolist?.name}</span>
			</div>

			<div className={styles.items}>
				{
					todolist?.items.map((item: TodoItem, i: number) => {
						return <TodoItemComponent key={i.toString()} {...item} refreshItems={refreshItems}/>
					})
				}
				<div className={styles.addItem} onClick={() => onOpenModal()}>
					<FaPlus />
				</div>
			</div>
			<AddItemModal open={openModal} onClose={onCloseModal} moduleName={todolist?.name} moduleId={todolist?.id}
				refreshItems={refreshItems} />
		</div>
	)
}