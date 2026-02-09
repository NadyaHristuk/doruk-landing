import { useEffect } from 'react';

const useCircleFilter = (containerSelector) => {
    useEffect(() => {
        const container = document.getElementById(containerSelector);
        if (!container) {
            console.error('Container not found');
            return;
        }

        const paths = Array.from(container.querySelectorAll('path'));

        const getPathPositions = () => {
            return paths.map((path) => {
                const rect = path.getBoundingClientRect();
                return {
                    path,
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                };
            });
        };

        let pathPositions = getPathPositions();

        const getDistance = (x1, y1, x2, y2) => {
            return Math.hypot(x2 - x1, y2 - y1);
        };

        const resetPaths = () => {
            paths.forEach((p) => {
                p.style.opacity = '';
                p.style.fill = '';
            });
        };

        let rafId = null;

        const handleMouseOver = (e) => {
            if (!e.target.matches('path')) return;

            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                resetPaths();

                const { left, top, width, height } = e.target.getBoundingClientRect();
                const centerX = left + width / 2;
                const centerY = top + height / 2;

                pathPositions.forEach(({ path, x, y }) => {
                    const distance = getDistance(centerX, centerY, x, y);

                    if (distance <= 20) {
                        path.style.opacity = '1';
                        path.style.fill = '#ffffff';
                    } 
                    // else if (distance <= 40) {
                    //     path.style.opacity = '0.8';
                    //     path.style.fill = '#ffffff';
                    // } else if (distance <= 60) {
                    //     path.style.opacity = '0.6';
                    //     path.style.fill = '#ffffff';
                    // }
                });

                e.target.style.opacity = '1';
            });
        };

        container.addEventListener('mouseover', handleMouseOver);

        return () => {
            container.removeEventListener('mouseover', handleMouseOver);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [containerSelector]);
};


export default useCircleFilter;
