import React from "react";
import '../styles/index.css'

import Header from "../components/Homepage/Header";
import Headline from "../components/Homepage/Headline";
import Features from "../components/Homepage/Features";
import Pricing from "../components/Homepage/Pricing";
import Footline from "../components/Homepage/Footline";
import Footer from "../components/Homepage/Footer";

const HomePage = () => {
    return (
        <div className="w-screen p-0 m-0 overflow-x-hidden">
            <Header />
            <Headline />
            <Features />
            <Pricing />
            <Footline />
            <Footer />
        </div>
    )
}

export default HomePage;