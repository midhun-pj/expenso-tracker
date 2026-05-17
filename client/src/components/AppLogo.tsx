import type { FC } from 'react';

import type { AppLogoProps } from '@models/app.model';


export const AppLogo: FC<AppLogoProps> = ({ size = 'md', color }) => {
    const iconClass = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={color ? { color } : undefined}
        >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    );
};
