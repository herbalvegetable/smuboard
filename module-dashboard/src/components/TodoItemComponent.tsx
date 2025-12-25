import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { calculateDateDiff } from "@/utils/calculateDateDiff";
import { getUrgencyColour } from "@/utils/getUrgencyColour";

import styles from "./TodoItemComponent.module.css";

import { customToast } from "@/utils/useCustomToast";

export default function TodoItemComponent(props: any) {
    const { id, moduleName, datetime, description, refreshItems } = props;

    const [diffMeasure, setDiffMeasure] = useState("mins");
    const [dateDiff, setDateDiff] = useState(0);
    const [urgencyColour, setUrgencyColour] = useState("inherit");

    useEffect(() => {
        const { measure, diff } = calculateDateDiff(dayjs(datetime, "YYYY-MM-DD HH:mm:ss"));
        console.log("todoitem datetime diff: ", datetime, measure, diff);
        setDiffMeasure(measure);
        setDateDiff(diff);

        const ucolour = getUrgencyColour(datetime);
        setUrgencyColour(ucolour);
    }, [datetime]);

    const [isHovering, setIsHovering] = useState(false);

    const handleMarkCompleted = (itemId: string) => {
        console.log("Delete todo item");
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/todoitem?id=${itemId}`, { method: 'DELETE' })
            .then(res => res.json()
            .then(data => {
                console.log(`DELETED item from ${moduleName}: `, data);
                refreshItems();
                customToast(`Completed item from ${moduleName}!`);
            }))
            .catch(err => console.log(err));
    }

    return (
        <div className={`${styles.item}`}
            onMouseEnter={e => setIsHovering(true)}
            onMouseLeave={e => setIsHovering(false)}
            onClick={e => {
                e.preventDefault();
                handleMarkCompleted(id);
            }}>

            <div className={`${styles.checkBox} ${isHovering ? styles.hovering : ""}`}
                style={{
                    backgroundColor: urgencyColour,
                }}>
                <button onClick={e => e.preventDefault()}></button>
            </div>

            <div className={styles.content}>
                <div className={styles.datetime}>
                    <span className={styles.dateText}>{dayjs(datetime, "YYYY-MM-DD HH:mm:ss").format("D MMM YY")}</span>
                    <span className={styles.diffText}>{dateDiff} {diffMeasure}{dateDiff > 1 ? "s" : ""} left</span>
                </div>
                <div className={styles.description}>
                    <span>{description}</span>
                </div>
            </div>

        </div>
    )
}