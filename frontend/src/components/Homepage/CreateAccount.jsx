import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const CreateAccount = ({ onClose }) => {
    const overlayRef = useRef();
    const [show, setShow] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

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

    // Formik initial values and onSubmit handler
    const initialValues = {
        username: '',
        email: '',
        password: '',
    };

    const handleSubmit = async (values) => {
        try {
            console.log("Form Submitted", values);

            // Send a POST request to the registration API
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                username: values.username,
                email: values.email,
                password: values.password
            });

            // Show success popup
            setShowSuccessPopup(true);

            // Hide success popup after 2 seconds
            setTimeout(() => {
                setShowSuccessPopup(false);
                onClose(); // Close modal
            }, 2000);

        } catch (error) {
            console.error('Error registering user:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-[#F4F4F4] opacity-30 z-20" />
            <div className="w-full h-full relative font-sserif" id="createAccountModal">
                <div
                    ref={overlayRef}
                    className={`fixed flex flex-col justify-center border border-[#C1C1C1] w-1/3 h-3/4 max-h-[580px] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#F4F4F4] shadow-xl rounded-xl py-8 overflow-y-auto z-20
                transition-opacity duration-300 transform ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                >
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <div className="px-8 mb-4">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <Field
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                <ErrorMessage name="username" component="div" className="text-red-500 text-xs" />
                            </div>
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
                                <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                            </div>
                            <div className="px-8 mb-6 w-full">
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
                                <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
                            </div>
                            <div className="px-8 mb-4">
                                <button
                                    type="submit"
                                    className="w-full bg-[#FF903D] text-white py-2 px-4 rounded-md hover:bg-[#FF8224] transition"
                                >
                                    Sign up
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
                        Already have an account? <span className="text-[#FF903D] underline" ><a href="">Log in!</a></span>
                    </p>
                </div>
                {showSuccessPopup && (
                    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md">
                        Account created successfully!
                    </div>
                )}
            </div>
        </>
    );
};

export default CreateAccount;