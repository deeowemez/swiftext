import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { default as jwtDecode } from 'jwt-decode';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

import googleLogo from "../../assets/images/google-logo.svg";

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const Login = ({
    setUser,
    onClose
}) => {
    const overlayRef = useRef();
    const [show, setShow] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    // useEffect(() => {
    //     const params = new URLSearchParams(window.location.search);
    //     const token = params.get('token');

    //     if (token) {
    //         localStorage.setItem('authToken', token);
    //         navigate('/profile'); // Redirect to a protected route
    //     }
    // }, []);

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
            // Authenticate user with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            // get Firebase JWT token
            const token = await user.getIdToken();
            console.log("Firebase Token:", token);

            // Send token to backend for verification
            // const response = await axios.post(`${backendUrl}/api/auth/verifyToken`, { token });
            const response = await axios.post(`${backendUrl}/api/auth/login`, { token, values });

            // console.log("Token verified:", response.data);
            if (response) {
                console.log('test response: ', response.data.response);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setUser(response.data.user);
            }

            setShowSuccessPopup(true); // Show success popup
            setTimeout(() => {
                setShowSuccessPopup(false);
                onClose();
            }, 1000);

        } catch (error) {
            console.error("Login error:", error);
            setLoginError("Invalid email or password"); // Set the error message
            setShowErrorPopup(true); // Show error popup
            setTimeout(() => setShowErrorPopup(false), 3000);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-[#F4F4F4] opacity-30 z-20" />
            <div className="w-full h-full relative font-sserif bg-black z-25">
                <div
                    ref={overlayRef}
                    className={`fixed flex flex-col justify-center border border-[#C1C1C1] w-1/3 h-2/3 max-h-[500px] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#F4F4F4] shadow-xl rounded-xl py-8 z-20 transition-all duration-300 transform ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                >
                    <Formik
                        initialValues={{ email: '', password: '' }}
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
                                <div className="flex">
                                    <Field
                                        type={isPasswordVisible ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        className="mt-1 block w-5/6 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="p-2 text-gray-500 focus:outline-none text-sm text-center"
                                    >
                                        {isPasswordVisible ? "Hide" : "Show"}
                                    </button>
                                </div>
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
                        <img src={googleLogo} alt="" className="w-11 cursor-pointer"
                            onClick={() => {
                                window.location.href = `${backendUrl}/auth/google`;
                            }}
                        />
                    </div>
                    <p className="text-xs text-center text-gray-600 mb-2">
                        No Account? <span className="text-[#FF903D] underline" ><a href="">Sign up!</a></span>
                    </p>
                    <p className="text-xs text-center text-gray-600">
                        Forgot Password? Reset <span className="text-[#3d50ff] underline" ><a href="">here</a></span>.
                    </p>
                </div>
                {showErrorPopup && (
                    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-md">
                        {loginError}
                    </div>
                )}

                {showSuccessPopup && (
                    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md">
                        Login successful!
                    </div>
                )}
            </div>
        </>
    );
};

export default Login;