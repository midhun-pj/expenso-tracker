import type { FC, ElementType } from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
    path: string;
    label: string;
    icon: ElementType;
    activeColor?: string;
    textColor?: string;
}

export const NavItem: FC<NavItemProps> = ({ path, label, icon: Icon, activeColor, textColor }) => (
    <NavLink
        to={path}
        className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive ? 'shadow-sm' : ''}`
        }
        style={({ isActive }) => ({
            color: isActive ? activeColor : textColor,
            backgroundColor: isActive ? undefined : 'transparent',
        })}
    >
        {({ isActive }) => (
            <>
                <Icon className="w-5 h-5" style={{ color: isActive ? activeColor : textColor }} />
                {label}
            </>
        )}
    </NavLink>
);

interface MobileNavItemProps {
    path: string;
    label: string;
    icon: ElementType;
    activeColor?: string;
    textColor?: string;
}

export const MobileNavItem: FC<MobileNavItemProps> = ({ path, label, icon: Icon, activeColor, textColor }) => (
    <NavLink
        to={path}
        className={() => 'flex flex-col items-center gap-1 p-2 rounded-lg'}
        style={({ isActive }) => ({ color: isActive ? activeColor : textColor })}
    >
        <Icon className="w-6 h-6" />
        <span className="text-[10px] font-medium">{label.split(' ')[0]}</span>
    </NavLink>
);
