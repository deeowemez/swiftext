import React, { useEffect, useRef, useState } from "react";

const Login = ({ onClose }) => {
    const overlayRef = useRef();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        setShow(true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="w-full h-full relative font-sserif bg-black z-25">
            <div
                ref={overlayRef} 
                className={`fixed flex flex-col justify-center border border-[#C1C1C1] w-1/3 h-2/3 max-h-[500px] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#F4F4F4] shadow-xl rounded-xl py-8 z-20 transition-all duration-300 transform ${
                    show ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
            >
                <form action="">
                    <div className="px-8 mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="px-8 mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="px-8 mb-4">
                        <button
                            type="submit"
                            className="w-full bg-[#FF903D] text-white py-2 px-4 rounded-md hover:bg-[#FF8224] transition"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <p className="text-xs text-center text-gray-600">
                    or login with
                </p>
                <div className="flex justify-center p-1">
                    <img src="src/assets/images/google-logo.svg" alt="" className="w-11 cursor-pointer"/>
                </div>
                <p className="text-xs text-center text-gray-600 mb-2">
                    No Account? <span className="text-[#FF903D] underline" ><a href="">Sign up!</a></span>
                </p>
                <p className="text-xs text-center text-gray-600">
                    Forgot Password? Reset <span className="text-[#3d50ff] underline" ><a href="">here</a></span>.
                </p>
            </div>
        </div>
    );
}

export default Login;