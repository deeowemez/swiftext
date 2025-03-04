import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";

import logoIcon from "../../assets/images/logo.svg";

const Header = ({
    user,
    setUser,
    onLoginClick,
    onSignUpClick
}) => {

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUser(user);
    }, []);

    const handleLogout = async() => {
        await signOut(auth);
        // Remove the token from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <header className="font-sserif text-sm text-[#5A5959] w-screen flex justify-between items-center py-1.5 px-36">
            <a href="/" className="flex">
                <img src={logoIcon} alt="Swiftext Logo" className="h-12 w-auto" />
                <div className="font-title text-3xl gradient-text font-bold py-2 px-1 cursor-pointer">Swiftext</div>
            </a>
            <nav>
                <ul className="flex gap-x-10 cursor-pointer">
                    <li><a href="/" className="text-[#5A5959]">Home</a></li>
                    {/* <li><a href="/edit" className="text-[#5A5959]">Edit</a></li> */}
                    <li><a href="/files" className="text-[#5A5959]">Files</a></li>
                </ul>
            </nav>
            <div className="flex gap-16 items-center">
                {user?.username ? (
                    <>
                        <div>
                            Hi, {user.username}!
                        </div>
                        <div onClick={handleLogout} className="p-2 rounded-md cursor-pointer flex gap-2.5 items-center hover:text-red-500">
                            Log out
                            <span className="pl-1 pt-1">↪</span>
                        </div>
                    </>
                ) : (
                    <>
                        <button onClick={onLoginClick}>
                            Log In
                        </button>
                        <button onClick={onSignUpClick}
                            className="border-2 border-[#FF903D] rounded-lg px-4 py-2 text-[#FF903D]">
                            Sign Up
                        </button>
                    </>
                )}
            </div>
            

        </header>
    )
}

export default Header;