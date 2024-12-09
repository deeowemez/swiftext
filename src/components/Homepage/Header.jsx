import React from "react";

const Header = ({
    onLoginClick,
    onSignUpClick
}) => {
    return (
        <header className="font-sserif text-sm text-[#5A5959] w-screen flex justify-between items-center py-1.5 px-36">
            <a href="/" className="flex">
                <img src="src/assets/images/logo.svg" alt="Swiftext Logo" className="h-12 w-auto" />
                <div className="font-title text-3xl gradient-text font-bold py-2 px-1 cursor-pointer">Swiftext</div>
            </a>
            <nav>
                <ul className="flex gap-x-10 cursor-pointer">
                    {/* <li><a href="/" className="text-[#5A5959]">Home</a></li> */}
                    {/* <li><a href="/edit" className="text-[#5A5959]">Edit</a></li> */}
                    {/* <li><a href="/files" className="text-[#5A5959]">Files</a></li> */}
                </ul>
            </nav>
            <div className="flex gap-10">
                <button onClick={onLoginClick}>
                    Log In
                </button>
                <button onClick={onSignUpClick}
                    className="border-2 border-[#FF903D] rounded-lg px-4 py-2 text-[#FF903D]">
                    Sign Up
                </button>
            </div>

        </header>
    )
}

export default Header;