export type ModuleLinkType = {
    moduleId: string,
    name: string,
    href: string,
}

export type SemesterWeek = {
    startDateStr: string,
    endDateStr: string,
}

export type TodoItem = {
    id: string,
    moduleName: string,
    datetime: string,
    description: string,
}

export type ModuleTodoType = {
    id: number,
    name: string,
    items: TodoItem[],
}

import { Session } from "@supabase/supabase-js"
export type SupabaseContextType = {
    supabase: any,
    session: Session | null,
    uuid: string | null,
    loading: boolean,
}