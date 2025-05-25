import {useEffect, useState} from 'react';

const MOBILE_BREAKPOINT = 768; // You can change this to your desired breakpoint

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < breakpoint);
        }

        window.addEventListener('resize', handleResize);
        handleResize(); // Call it once to set the initial value

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [breakpoint]);

    return isMobile;
}

export default useIsMobile;
