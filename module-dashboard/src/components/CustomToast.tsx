import toast, { Toaster } from 'react-hot-toast';
import styles from './CustomToast.module.css';
import { FaX } from 'react-icons/fa6';

interface CustomToastProps{
    t: any;
    message: string;
}

function CustomToast({ t, message }: CustomToastProps) {
    const dismissClass = t.visible ? '' : styles.dismiss;

    return (
        <div className={`${styles.toast} ${dismissClass}`}>
            <span className={styles.message}>{message}</span>
            <button onClick={e => {
                e.stopPropagation();
                console.log('DISMISS TOAST notification');
                toast.dismiss(t.id);
            }} className={styles.dismissBtn}>
                <FaX />
            </button>
        </div>
    )
}

export default CustomToast;