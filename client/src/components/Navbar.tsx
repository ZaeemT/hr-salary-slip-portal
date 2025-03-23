import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { ModeToggle } from './mode-toggle';
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logout } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        Logout();
        navigate('/');
    };

    const isActivePath = (path: string) => {
        return location.pathname === path
    }

    const getLinkClass = (path: string) => {
        return `hover:text-gray-400 ${isActivePath(path) ? 'text-primary font-semibold' : ''}`
    }

    return (
        <nav className="shadow-lg bg-secondary">
            <div className="max-w-8xl px-5">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/home" className="flex items-center justify-start">
                            <Logo />
                            <span className="font-exo2 font-bold text-xl p-3">HR Salary Slip Portal</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6 font-inter">
                        <Link to="/home" className={getLinkClass('/home')}>
                            Home
                        </Link>
                        <Link to="/upload" className={getLinkClass('/upload')}>
                            Upload
                        </Link>
                        <Link to="/profile" className={getLinkClass('/profile')}>
                            Profile
                        </Link>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleLogout}
                            className="gap-2 hover:text-destructive"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                        <ModeToggle />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="hover:text-gray-400 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 font-inter">
                            <Link
                                to="/home"
                                className={`block px-3 py-2 hover:text-gray-400 ${
                                    isActivePath('/home') ? 'text-primary font-semibold' : ''
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/upload"
                                className={`block px-3 py-2 hover:text-gray-400 ${
                                    isActivePath('/upload') ? 'text-primary font-semibold' : ''
                                }`}
                            >
                                Upload
                            </Link>
                            <Link
                                to="/profile"
                                className={`block px-3 py-2 hover:text-gray-400 ${
                                    isActivePath('/profile') ? 'text-primary font-semibold' : ''
                                }`}
                            >
                                Profile
                            </Link>
                            <div className="px-3 py-2">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleLogout}
                                    className="gap-2 w-full justify-start hover:text-destructive"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                                <div className="px-3 py-2">
                                    <ModeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;