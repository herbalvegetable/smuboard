import toast, { Toaster } from 'react-hot-toast';
import { CustomToast } from '@/components';


export const customToast = (message: string) => {
    console.log('show custom toast');
    toast.custom((t: any) => <CustomToast t={t} message={message}/>);
}