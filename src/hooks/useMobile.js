import { useEffect, useState } from 'react';

const useMobile = (breakpoint = 1500) => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            return width < breakpoint;
        }
        return false;
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            setIsMobile(width < breakpoint);
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
};

export default useMobile;
