import dayjs, { Dayjs, UnitTypeLong } from "dayjs";

export function calculateDateDiff(date: Dayjs): { measure: string, diff: number } {
    const now = dayjs();

    const diffMeasures: UnitTypeLong[] = ["month", "day", "hour", "minute"];
    let measure = "minute";
    let diff = -1;
    let diffVal = 0;

    for (let _measure of diffMeasures) {
        diffVal = date.diff(now, _measure);
        if (diffVal >= 1) {
            measure = _measure as string;
            diff = diffVal;
            break;
        }
    }
    if (diff < 0) {
        diff = diffVal; // if diff still -1, measure will be "minute", just change diff value;
    }

    return { measure, diff };
}