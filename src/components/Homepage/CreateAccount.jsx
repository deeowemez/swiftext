import React from "react";

const CreateAccount = () => {
    return (
        <div className="w-full h-full relative font-sserif">
            <div className="fixed flex flex-col justify-center border border-[#C1C1C1] w-1/3 h-3/4 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#F4F4F4] shadow-xl rounded-xl py-8 overflow-y-auto">
                <form action="">
                    <div className="px-8 mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="username"
                            id="username"
                            name="username"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
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
                            Sign up
                        </button>
                    </div>
                </form>
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
        </div>
    );
}

export default CreateAccount;