import { useEffect } from 'react';

export const useGoogleSession = (session: any, logoutAction: any) => {
    useEffect(() => {
        if(session){
            // const timeoutDuration = session.expires_in * 1000;
            const timeoutDuration = session.expires_at * 1000 - Date.now();
            console.log('Timeout duration: ', timeoutDuration / 1000, ' seconds');

            const timer = setTimeout(() => {
                console.log('Session expired. Logging out...');
                logoutAction();
            }, timeoutDuration);

            // clean up timer if component unmounts or user logs out manually
            return () => {
                console.log('CLEAR session expiry timer.');
                clearTimeout(timer);
            };
        }
    }, [session, logoutAction]);
}