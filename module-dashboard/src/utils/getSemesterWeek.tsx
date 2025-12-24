import dayjs, { Dayjs } from "dayjs";
import { SemesterWeek } from "@/types";

/*
semesterWeeks = [
    {startDate, endDate}
    {startDate, endDate}
    {startDate, endDate}
    ...
]
*/

// init academic year - sem 1 & 2 weeks
function getAcadYear(): SemesterWeek[][] {
    let numWeeks = 14;
    let acadYear: SemesterWeek[][] = [[], []]; // arr of 2 lists of sem weeks (sem 1 & 2)

    let sem1FirstSun = dayjs(new Date(dayjs().year(), 7, 17));
    let sem1FirstSat = sem1FirstSun.add(6, 'day');
    for (let i = 0; i < numWeeks; i++) {
        let addDays = 7 * i;
        let startDateStr = sem1FirstSun.add(addDays, "day").format("YYYY-MM-DD HH:mm:ss");
        let endDateStr = sem1FirstSat.add(addDays, "day").format("YYYY-MM-DD HH:mm:ss");

        acadYear[0].push({ startDateStr, endDateStr });
    }

    let sem2FirstSun = dayjs(new Date(dayjs().year(), 1, 12));
    let sem2FirstSat = sem2FirstSun.add(6, 'day');
    for (let i = 0; i < numWeeks; i++) {
        let addDays = 7 * i;
        let startDateStr = sem2FirstSun.add(addDays, "day").format("YYYY-MM-DD HH:mm:ss");
        let endDateStr = sem2FirstSat.add(addDays, "day").format("YYYY-MM-DD HH:mm:ss");

        acadYear[1].push({ startDateStr, endDateStr });
    }

    return acadYear;
}


export function getSemesterWeek(): { semNum: number, weekNum: number } {
    const acadYear = getAcadYear();

    let semNum = -1;
    let weekNum = -1;
    let currDate = dayjs();
    // let currDate = dayjs('2025-10-18'); // for debugging

    for (var i = 0; i < acadYear[0].length; i++) {
        let { startDateStr, endDateStr } = acadYear[0][i];

        let endDate = dayjs(endDateStr, "YYYY-MM-DD HH:mm:ss");
        if (endDate.isAfter(currDate)) {
            // console.log("endDate = ", endDate.format("YYYY-MM-DD HH:mm:ss"));
            // console.log("currDate = ", currDateStr);
            // console.log("i = ", i, "weekNum = ", i + 1);
            semNum = 1;
            weekNum = i + 1;
            return { semNum, weekNum };
        }
    }

    for (var i = 0; i < acadYear[1].length; i++) {
        let { startDateStr, endDateStr } = acadYear[1][i];

        let endDate = dayjs(endDateStr, "YYYY-MM-DD HH:mm:ss");
        if (endDate.isAfter(currDate)) {
            // console.log("endDate = ", endDate.format("YYYY-MM-DD HH:mm:ss"));
            // console.log("currDate = ", currDateStr);
            // console.log("i = ", i, "weekNum = ", i + 1);
            semNum = 2;
            weekNum = i + 1;
            return { semNum, weekNum };
        }
    }

    // set semester num
    let sem1StartDate = dayjs(acadYear[0][0].startDateStr, "YYYY-MM-DD HH:mm:ss");
    let sem2StartDate = dayjs(acadYear[1][0].startDateStr, "YYYY-MM-DD HH:mm:ss");
    let sem1EndDate = dayjs(acadYear[0][acadYear[0].length - 1].endDateStr, "YYYY-MM-DD HH:mm:ss");
    let sem2EndDate = dayjs(acadYear[1][acadYear[1].length - 1].endDateStr, "YYYY-MM-DD HH:mm:ss");

    if(currDate.isAfter(sem1EndDate)){
        semNum = 1;
    }
    else if(currDate.isAfter(sem2EndDate)){
        semNum = 2;
    }

    return { semNum, weekNum };
}