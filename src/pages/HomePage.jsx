import React from "react";
import '../index.css'

import Header from "../components/Header";
import Headline from "../components/Headline";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Footline from "../components/Footline";
import Footer from "../components/Footer";

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