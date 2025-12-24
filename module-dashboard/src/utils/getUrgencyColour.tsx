import dayjs, { Dayjs } from 'dayjs';

export function getUrgencyColour(itemDateStr: string): string {
    let itemDate = dayjs(itemDateStr, "YYYY-MM-DD HH:mm:ss");
    let hourDiff = itemDate.diff(dayjs(), 'hour');
    /*
    green = 7 days
    yellow = 4 days
    orange = 2 days
    red = 1 day
    */

    let brackets = [
        {minDuration: 7 * 24, colour: "rgb(0, 48, 73)"},
        {minDuration: 4 * 24, colour: "rgb(152, 147, 218)"},
        {minDuration: 2 * 24, colour: "rgb(247, 127, 0)"},
        {minDuration: 1 * 24, colour: "rgb(238, 108, 77)"},
    ]

    for (let {minDuration, colour} of brackets){
        if(hourDiff > minDuration){
            return colour;
        }
    }

    return brackets[brackets.length - 1].colour;
}