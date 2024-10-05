import React from "react";
import '../index.css'

import Header from "../components/Header";
import Footer from "../components/Footer"

const HomePage = () => {
    return (
        <div className="w-screen p-0 m-0 overflow-x-hidden">
            <Header />
            <Footer />
        </div>
    )
}

export default HomePage;