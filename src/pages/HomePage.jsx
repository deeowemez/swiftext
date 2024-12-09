import React, { useEffect, useRef, useState } from "react";
import '../styles/index.css'

import Header from "../components/Homepage/Header";
import Headline from "../components/Homepage/Headline";
import Features from "../components/Homepage/Features";
import Pricing from "../components/Homepage/Pricing";
import Footline from "../components/Homepage/Footline";
import Footer from "../components/Homepage/Footer";
import Login from "../components/Homepage/Login";
import CreateAccount from "../components/Homepage/CreateAccount";


const HomePage = ({
    user,
    setUser }) => {
    const [overlayType, setOverlayType] = useState(null);

    const handleOverlayClose = () => {
        setOverlayType(null);
    };

    useEffect(() => {
        if (user) {
            console.log("User changed:", user);
        }
    }, [user]);

    return (
        <div className="w-screen p-0 m-0 overflow-x-hidden">
            <Header
                user={user}
                setUser={setUser}
                onLoginClick={() => setOverlayType("login")}
                onSignUpClick={() => setOverlayType("createAccount")}
            />
            <Headline />
            <Features />
            <Pricing />
            <Footline />
            <Footer />

            {overlayType === "login" &&
                <Login
                    setUser={setUser}
                    onClose={handleOverlayClose}
                />}
            {overlayType === "createAccount" && <CreateAccount onClose={handleOverlayClose} />}
        </div>
    )
}

export default HomePage;