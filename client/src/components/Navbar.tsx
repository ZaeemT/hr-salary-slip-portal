import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

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
                    <div className="hidden md:flex space-x-8 font-inter">
                        <Link to="/home" className='hover:text-gray-400'>
                            Home
                        </Link>
                        <Link to="/upload" className='hover:text-gray-400'>
                            Upload
                        </Link>
                        <Link to="/profile" className='hover:text-gray-400'>
                            Profile
                        </Link>
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
                                className="block px-3 py-2 hover:text-gray-400"
                            >
                                Home
                            </Link>
                            <Link
                                to="/upload"
                                className="block px-3 py-2 hover:text-gray-400"
                            >
                                Upload
                            </Link>
                            <Link
                                to="/profile"
                                className="block px-3 py-2 hover:text-gray-400"
                            >
                                Profile
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;