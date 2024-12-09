import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { default as jwtDecode } from 'jwt-decode';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const Login = ({ 
    onClose,
    setUser, }) => {
    const overlayRef = useRef();
    const [show, setShow] = useState(false);
    const [loginError, setLoginError] = useState("");

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

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', values);
            const { token } = response.data;

            // Store the token (example using localStorage)
            localStorage.setItem('authToken', token);

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userID; // Access the `id` from the payload
        
            console.log("Decoded User:", decodedToken);
        
            // Set the userID in the state or context
            setUser(decodedToken);
            onClose();

        } catch (error) {
            console.error("Login error:", error);
            setLoginError("Invalid email or password"); // Set the error message
        }
    };

    return (
        <div className="w-full h-full relative font-sserif bg-black z-25">
            <div
                ref={overlayRef}
                className={`fixed flex flex-col justify-center border border-[#C1C1C1] w-1/3 h-2/3 max-h-[500px] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#F4F4F4] shadow-xl rounded-xl py-8 z-20 transition-all duration-300 transform ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
            >
                <Formik
                    initialValues={{ email: '', password: ''}}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="px-8 mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Field
                                type="email"
                                id="email"
                                name="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                        </div>
                        <div className="px-8 mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Field
                                type="password"
                                id="password"
                                name="password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                        </div>
                        <div className="px-8 mb-4">
                            <button
                                type="submit"
                                className="w-full bg-[#FF903D] text-white py-2 px-4 rounded-md hover:bg-[#FF8224] transition"
                            >
                                Login
                            </button>
                        </div>
                    </Form>
                </Formik>
                <p className="text-xs text-center text-gray-600">
                    or login with
                </p>
                <div className="flex justify-center p-1">
                    <img src="src/assets/images/google-logo.svg" alt="" className="w-11 cursor-pointer" />
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
};

export default Login;