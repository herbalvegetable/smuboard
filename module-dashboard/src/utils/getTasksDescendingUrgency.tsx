import dayjs, { Dayjs } from "dayjs";
import { ModuleTodoType, TodoItem } from "@/types";


export function getTasksDescendingUrgency(modules: ModuleTodoType[]): TodoItem[]{
    let newItems: TodoItem[] = [];

    for (let mtodo of modules){
        newItems = [...newItems, ...mtodo.items];
    }
    
    newItems.sort((item1, item2) => {
        let date1 = dayjs(item1.datetime, "YYYY-MM-DD HH:mm:ss");
        let date2 = dayjs(item2.datetime, "YYYY-MM-DD HH:mm:ss");

        return date1.diff(date2, "minute");
    });

    return newItems;
}