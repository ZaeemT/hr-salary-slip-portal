import React from 'react';
import logo from '@/assets/logo.svg';

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', width = 50, height = 50 }) => {
    return (
        <img
            src={logo}
            alt="Company Logo"
            className={className}
            width={width}
            height={height}
        />
    );
};

export default Logo;