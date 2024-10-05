import React from "react";

const Header = () => {
    return (
        <header className="font-sserif text-sm text-[#5A5959] w-screen flex justify-between items-center py-1.5 px-36">
            <div className="flex">
                <img src="src/assets/images/logo.svg" alt="Swiftext Logo" className="h-12 w-auto" />
                <div className="font-title text-3xl gradient-text font-bold py-2 px-1 cursor-pointer">Swiftext</div>
            </div>
            <nav >
                <ul className="flex gap-x-10 cursor-pointer">
                    <li><a href="/">Home</a></li>
                    <li><a href="/edit">Edit</a></li>
                    <li>Files</li>
                </ul>
            </nav>
            <div className="flex gap-10">
                <button>
                    Log In
                </button>
                <button className="border-2 border-[#FF903D] rounded-lg px-4 py-2 text-[#FF903D]">
                    Sign Up
                </button>
            </div>

        </header>
    )
}

export default Header;