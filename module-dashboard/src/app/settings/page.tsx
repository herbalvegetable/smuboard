"use client"
import React, { useState, useEffect, useContext } from 'react';
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { FaPlus, FaPen, FaTrash } from "react-icons/fa6";
import { Modal, Box, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import styles from './page.module.css'

import { Page } from '@/components';

import { useSupabase } from '@/context/SupabaseContext';
import { ModuleNamesContext } from '@/context/ModuleNamesContext';

function LogoutButton(props: any) {

    const { handleLogout } = props;

    return (
        <div className={styles.logoutButton}>
            <button onClick={e => handleLogout()}>
                <span>Sign Out</span>
            </button>
        </div>
    )
}

function AddListModal(props: any) {
    const { open, onClose } = props;
    const { uuid, loading } = useSupabase();
    const { fetchUserTodolists } = useContext(ModuleNamesContext);

    const [moduleName, setModuleName] = useState<string>('');

    const customTheme = createTheme({
        typography: {
            fontFamily: 'Lexend, sans-serif',
        },
    });

    const handleSubmit = (userId: string, moduleName: string) => {
        if (moduleName === '') return;
        console.log('userId: ', userId);

        let data = {
            userId: userId,
            moduleName: moduleName,
        }
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/todolist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then(res => res.json()
                .then(data => {
                    console.log('REQUEST SUCCESS: Create todolist: ', data.data);

                    // clear user inputs
                    setModuleName('');

                    // refresh items
                    fetchUserTodolists(userId);

                    //close modal
                    onClose();
                }))
            .catch(err => console.log(err));
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box className={styles.addListModal}>
                <span className={styles.title}>Add Module</span>
                <ThemeProvider theme={customTheme}>
                    <TextField
                        label="Module Name"
                        variant="standard"
                        value={moduleName}
                        onChange={e => {
                            setModuleName(e.target.value);
                        }}
                        fullWidth />
                </ThemeProvider>
                <button className={styles.submitBtn}
                    onClick={e => {
                        if (loading) {
                            console.log('Supabase loading...');
                        }
                        else {
                            handleSubmit(uuid!, moduleName);
                        }
                    }}>
                    Add Module
                </button>
            </Box>
        </Modal >
    )
}


function EditListModal(props: any) {
    const { open, onClose } = props;
    const { uuid, loading: supabaseLoading } = useSupabase();
    const { modules, isLoading: modNamesLoading, fetchUserTodolists } = useContext(ModuleNamesContext);

    const [prevModuleNames, setPrevModuleNames] = useState<any[]>([]);
    const [moduleNames, setModuleNames] = useState<any[]>([]);

    const customTheme = createTheme({
        typography: {
            fontFamily: 'Lexend, sans-serif',
        },
    });

    const initModules = () => {
        if (!modNamesLoading) {
            let modNames = Object.values(modules);
            setPrevModuleNames(modNames);
            setModuleNames(modNames);
        }
    }
    useEffect(() => {
        initModules();
    }, [modNamesLoading]);

    const handleDeleteTodolist = (modId: string, userId: string) => {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/todolist?id=${modId}&userId=${userId}`, {
            method: 'DELETE',
        })
            .then(res => res.json()
                .then(data => {
                    // refresh modules
                    fetchUserTodolists(userId); // moduleNames will reload due to change to modNamesLoading
                }))
            .catch(err => console.log(err));
    }

    const handleUpdateTodolist = (userId: string) => {
        let data = {
            userId: userId,
            modules: [...moduleNames],
        };
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/todolist?userId=${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then(res => res.json()
                .then(data => {
                    console.log('edited todolists: ', data.status);
                    // refresh modules
                    fetchUserTodolists(userId); // moduleNames will reload due to change to modNamesLoading
                    // close modal
                    onClose();
                }))
            .catch(err => console.log(err));
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box className={styles.editListModal}>
                <span className={styles.title}>Edit Modules</span>
                {
                    moduleNames.length > 0 && !supabaseLoading ?
                        <>
                            <div className={styles.modules}>
                                <ThemeProvider theme={customTheme}>
                                    {
                                        moduleNames.map((mod: any, i: number) => {
                                            return (
                                                <div key={i.toString()}
                                                    className={styles.moduleContainer}>
                                                    <span className={styles.title}>{prevModuleNames[i].name}</span>
                                                    <TextField
                                                        variant="standard"
                                                        value={mod.name}
                                                        onChange={e => {
                                                            let newModNames = [...moduleNames];
                                                            if (e.target.value == "") {
                                                                newModNames[i].name = prevModuleNames[i].name;
                                                            }
                                                            else {
                                                                newModNames[i].name = e.target.value;
                                                            }
                                                            setModuleNames(newModNames);
                                                        }} />
                                                    <button className={styles.deleteBtn}
                                                        onClick={e => {
                                                            handleDeleteTodolist(mod.id, uuid!);
                                                        }}>
                                                        <FaTrash className={styles.icon} />
                                                    </button>
                                                </div>
                                            )
                                        })
                                    }
                                </ThemeProvider>
                            </div>
                            <button className={styles.submitBtn}
                                onClick={e => handleUpdateTodolist(uuid!)}>
                                <span>Apply Changes</span>
                            </button>
                        </>
                        :
                        <span>Loading modules...</span>
                }
            </Box>
        </Modal>
    )
}

export default function Module() {

    const { supabase } = useSupabase();

    const handleLogout = () => {
        console.log("user sign out");
        supabase.auth.signOut({ scope: "global" })
            .then((data: any) => {
                console.log(data);
            })
            .catch((err: any) => console.log("SUPABASE SIGNOUT ERROR: ", err));
    }

    const [openAddListModal, setOpenAddListModal] = useState(false);
    const onOpenAddListModal = () => {
        setOpenAddListModal(true);
    }
    const onCloseAddListModal = () => {
        setOpenAddListModal(false);
    }

    const [openEditListModal, setOpenEditListModal] = useState(false);
    const onOpenEditListModal = () => {
        setOpenEditListModal(true);
    }
    const onCloseEditListModal = () => {
        setOpenEditListModal(false);
    }

    return (
        <div className={styles.main}>
            <h1 className={styles.title}>Settings</h1>

            <div className={styles.settingActions}>
                <span className={styles.title}>Modules</span>
                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={onOpenAddListModal}>
                        <FaPlus />
                        <span>Add Module</span>
                    </button>
                    <button className={styles.actionBtn} onClick={onOpenEditListModal}>
                        <FaPen />
                        <span>Edit Modules</span>
                    </button>
                </div>
            </div>
            <AddListModal open={openAddListModal} onClose={onCloseAddListModal} />
            <EditListModal open={openEditListModal} onClose={onCloseEditListModal} />

            <div className={styles.settingActions}>
                <span className={styles.title}>Account</span>
                <LogoutButton handleLogout={handleLogout} />
            </div>
        </div>
    )
}