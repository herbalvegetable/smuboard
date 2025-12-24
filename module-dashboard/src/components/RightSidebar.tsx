import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

import styles from "./RightSidebar.module.css";

import { useSupabase } from '@/context/SupabaseContext';

// Utils
import { getCalendarEvents, getCalendarList } from '@/utils/googleCalendar';

type CalendarEventType = {
    summary: string,
    location: string,
    startDatetime: string,
    endDatetime: string,
    htmlLink: string,
    bgColour: string,
    fgColour: string,
}

type CalendarEventsByDateType = {
    datetime: string,
    events: CalendarEventType[];
}

const GOOGLE_EVENT_COLORS = {
    "1": { background: "#a4bdfc", foreground: "#1d1d1d" },
    "2": { background: "#7ae7bf", foreground: "#1d1d1d" },
    "3": { background: "#dbadff", foreground: "#1d1d1d" },
    "4": { background: "#ff887c", foreground: "#1d1d1d" },
    "5": { background: "#fbd75b", foreground: "#1d1d1d" },
    "6": { background: "#ffb878", foreground: "#1d1d1d" },
    "7": { background: "#46d6db", foreground: "#1d1d1d" },
    "8": { background: "#e1e1e1", foreground: "#1d1d1d" },
    "9": { background: "#5484ed", foreground: "#ffffff" },
    "10": { background: "#51b749", foreground: "#ffffff" },
    "11": { background: "#dc2127", foreground: "#ffffff" }
};

export default function RightSidebar(props: any) {
    const { session, loading } = useSupabase();

    // const [calendarEvents, setCalendarEvents] = useState<CalendarEventType[]>([]);
    const [calEventsByDate, setCalEventsByDate] = useState<CalendarEventsByDateType[]>([]);

    const findCalEventByDate = (datetimeStr: string, calEventsByDate: any[]) => {
        let condition = (evt: CalendarEventsByDateType) => evt.datetime == datetimeStr;

        let dateEvent = calEventsByDate.filter(condition)[0];
        let index = calEventsByDate.findIndex(condition);

        return [dateEvent, index];
    }

    const fetchCalendarEvents = async (session: any, calendarId: string) => {
        const evts = await getCalendarEvents(session, calendarId) as any;
        let calEvents = evts.map((evt: any, i: number) => {
            return {
                summary: evt.summary,
                location: evt.location,

                startDatetime: evt.start.dateTime,
                endDatetime: evt.end.dateTime,
                startDate: evt.start.date,
                endDate: evt.end.date,

                htmlLink: evt.htmlLink,
                bgColour: evt.colorId ? GOOGLE_EVENT_COLORS[evt.colorId.toString()].background : "#468ABC",
                fgColour: evt.colorId ? GOOGLE_EVENT_COLORS[evt.colorId.toString()].foreground : "#1d1d1d",
            }
        });
        console.log("CAL EVENTS: ", calEvents);

        let _calEventsByDate: CalendarEventsByDateType[] = [];

        let currentDate = dayjs(calEvents[0].startDatetime ?? calEvents[0].startDate);
        let currentCalEventByDate: CalendarEventsByDateType = {
            datetime: currentDate.format("YYYY-MM-DD"),
            events: [],
        }
        let currentCalEvents: CalendarEventType[] = [];

        for (let calEvent of calEvents) {
            let eventDateStr = dayjs(calEvent.startDatetime ?? calEvent.startDate).format("YYYY-MM-DD");
            if (eventDateStr == currentCalEventByDate.datetime) {
                // check if calEvent is a day(s) event
                // if no, then add
                if(!calEvent.startDate && calEvent.startDatetime){
                    currentCalEvents.push({ ...calEvent });
                }
            }
            else {
                // add currentCalEventByDate to _calEventsByDate
                currentCalEventByDate.events = [...currentCalEvents];
                _calEventsByDate.push({ ...currentCalEventByDate });

                // reset currentCalEventByDate, currentCalEvents with current event already in list
                currentCalEventByDate = {
                    datetime: eventDateStr,
                    events: [],
                }
                currentCalEvents = [];
                // check if calEvent is a day(s) event
                // if no, then add
                if(!calEvent.startDate && calEvent.startDatetime){
                    currentCalEvents.push({ ...calEvent });
                }
            }
        }
        //fencepost, add events on last date into list
        currentCalEventByDate.events = [...currentCalEvents];
        _calEventsByDate.push({ ...currentCalEventByDate });

        // settle events that span across multiple days
        for (let calEvent of calEvents){
            // check if event is a day(s) event
            if(calEvent.startDate && !calEvent.startDatetime){
                let currDate = dayjs(calEvent.startDate);
                let [_, startCalEventByDateIndex] = findCalEventByDate(currDate.format("YYYY-MM-DD"), _calEventsByDate);

                let endDate = dayjs(calEvent.endDate);
                let dayNum = endDate.diff(currDate, 'day');
                console.log('event & days num: ', calEvent.summary, dayNum);

                for(let i = 0; i < dayNum; i++){
                    // check if date evt exists
                    let [dateEvt, dateEvtIndex] = findCalEventByDate(currDate.format("YYYY-MM-DD"), _calEventsByDate);
                    // console.log('date evt: ', dateEvt, dateEvtIndex);

                    let editedCalEvent = {...calEvent};
                    // add day counter, ONLY edit if event spans across multiple days
                    if(dayNum > 1){
                        editedCalEvent.summary += ` (${i + 1}/${dayNum})`;
                    }

                    if(dateEvt){ // add to date event
                        dateEvt.events.push(editedCalEvent);
                    }
                    else{ // create new date event and add event to it
                        let newCalEventByDate = {
                            datetime: currDate.format("YYYY-MM-DD"),
                            events: [editedCalEvent], // init event list with one event inside
                        }
                        // insert at index
                        _calEventsByDate.splice(startCalEventByDateIndex + i, 0, newCalEventByDate);
                    }

                    // increment curr date
                    currDate = currDate.add(1, 'day');
                }
            }
        }

        setCalEventsByDate(_calEventsByDate);
    }

    // Get calendar events
    useEffect(() => {
        if (session) {
            // getCalendarList(session);
            fetchCalendarEvents(session, "primary");
        }
    }, [session]);

    const { sidebarWidth } = props;
    return (
        <div className={styles.sideContent}
            style={{
                width: `${sidebarWidth}px`,
            }}>
            <div className={styles.sideContainer}>
                <div className={styles.title}>
                    <span>Upcoming Events</span>
                </div>
                <div className={styles.scrollContainer}>
                    {
                        calEventsByDate.map((evtsByDate: CalendarEventsByDateType, evtsByDateIndex: number) => {
                            let dateStr = dayjs(evtsByDate.datetime).format("D MMM YYYY");
                            return <React.Fragment key={evtsByDateIndex.toString()}>
                                <div className={styles.dateDivider}>
                                    <span>{dateStr}</span>
                                </div>
                                {
                                    evtsByDate.events.map((evt: CalendarEventType, evtIndex: number) => {
                                        let start = dayjs(evt.startDatetime);
                                        let end = dayjs(evt.endDatetime);

                                        let startTimeStr = start.format('h:mm a');
                                        let endTimeStr = end.format('h:mm a');

                                        return (
                                            <div key={evtIndex.toString()} className={styles.calendarEvent}>
                                                <div className={styles.mark}
                                                    style={{ backgroundColor: evt.bgColour }}></div>
                                                <div className={styles.content}>
                                                    <div className={styles.summary}>
                                                        <span>{evt.summary}</span>
                                                    </div>
                                                    {
                                                        evt.startDatetime &&
                                                        <div className={styles.startDatetime}>
                                                            <span>{startTimeStr} - {endTimeStr}</span>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </React.Fragment>
                        })
                    }
                    {/* {
                        calendarEvents.map((evt: CalendarEventType, i: number) => {
                            let start = dayjs(evt.startDatetime);
                            let end = dayjs(evt.endDatetime);

                            let startTimeStr = start.format('h:mm a');
                            let endTimeStr = end.format('h:mm a');

                            return (
                                <div key={i.toString()} className={styles.calendarEvent}>
                                    <div className={styles.mark}
                                        style={{ backgroundColor: evt.bgColour }}></div>
                                    <div className={styles.content}>
                                        <div className={styles.summary}>
                                            <span>{evt.summary}</span>
                                        </div>
                                        {
                                            evt.startDatetime &&
                                            <div className={styles.startDatetime}>
                                                <span>{startTimeStr} - {endTimeStr}</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    } */}
                </div>
            </div>
        </div>
    );
}