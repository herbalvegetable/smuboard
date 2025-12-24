import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { calculateDateDiff } from "@/utils/calculateDateDiff";
import { getUrgencyColour } from "@/utils/getUrgencyColour";

import styles from "./SmallTodoItem.module.css";

export default function SmallTodoItem(props: any) {
    const { datetime, description, moduleName } = props;

    const [diffMeasure, setDiffMeasure] = useState("mins");
    const [dateDiff, setDateDiff] = useState(0);
    const [urgencyColour, setUrgencyColour] = useState("inherit");

    useEffect(() => {
        const { measure, diff } = calculateDateDiff(dayjs(datetime, "YYYY-MM-DD HH:mm:ss"));
        setDiffMeasure(measure);
        setDateDiff(diff);

        const ucolour = getUrgencyColour(datetime);
        setUrgencyColour(ucolour);
    }, []);

    const [isHovering, setIsHovering] = useState(false);

    const handleMarkCompleted = () => {
        console.log("Delete todo item");
    }

    return (
        <div className={`${styles.item}`}
            onMouseEnter={e => setIsHovering(true)}
            onMouseLeave={e => setIsHovering(false)}
            onClick={e => {
                e.preventDefault();
                handleMarkCompleted();
            }}>

            <div className={`${styles.checkBox} ${isHovering ? styles.hovering : ""}`}
                style={{
                    backgroundColor: urgencyColour,
                }}>
                <button onClick={e => e.preventDefault()}></button>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.moduleName}>{moduleName}</span>
                    <div className={styles.dateContent}>
                        <span className={styles.dateText}>{dayjs(datetime, "YYYY-MM-DD HH:mm:ss").format("D MMM YY - h:mm a")}</span>
                        <span className={styles.diffText}>{dateDiff} {diffMeasure}{dateDiff > 1 ? "s" : ""} left</span>
                    </div>
                </div>
                <div className={styles.description}>
                    <span>{description}</span>
                </div>
            </div>
        </div>
    )
}