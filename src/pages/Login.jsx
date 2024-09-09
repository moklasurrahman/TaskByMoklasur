import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [getEmailError, setEmailError] = useState(null);
    const [getPasswordError, setPasswordError] = useState(null);
    const [getInvalidloginInput, setInvalidloginInput] = useState(null);
    const [loginError, setloginError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        const formData = { email, password };

        try {
            const response = await axios.post('https://hotel.aotrek.net/api/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.user && response.data.user.token) {
                const { token } = response.data.user;
                const { message } = response.data;
                console.log( message)
                // Store token in session storage
                sessionStorage.setItem("access_token", token);
                navigate('/products');
                

            } else {
                setloginError('Unexpected response structure.');
            }

        } catch (error) {
            if (error.response && error.response.data) {
                // Handle specific error messages
                const { message } = error.response.data;
                setloginError(message || "An error occurred during login.");
            } else {
                // Handle network errors or unexpected issues
                setloginError("Network error or server is unavailable.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        let isValid = true;

        if (!email.trim()) {
            setEmailError("Email is required");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Invalid email address");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!password.trim()) {
            setPasswordError("Password is required");
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    return (
        <div>
            <div className="font-[sans-serif] text-[#333]">
                <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                    <div className="grid md:grid-cols-1 items-center max-w-6xl w-full">
                        <div className="rounded-xl shadow-lg border-2 border-indigo-300 w-full max-w-md mx-auto p-6">
                            <form className="space-y-6 max-w-md md:ml-auto max-md:mx-auto w-full ">
                                <h3 className="text-3xl font-extrabold mb-8 max-md:text-center">
                                    Sign in
                                </h3>
                                {getInvalidloginInput && (
                                    <p className="text-[12px] text-red-600">
                                        {getInvalidloginInput} Check email or password
                                    </p>
                                )}

                                <div>
                                    <input
                                        name="email"
                                        type="email"
                                        onChange={(event) => setEmail(event.target.value)}
                                        value={email}
                                        required
                                        className="bg-gray-100 w-full text-sm px-4 py-3.5 rounded-md outline-blue-600"
                                        placeholder="Email address"
                                    />
                                    {getEmailError && <p className="text-[10px] text-red-600 py-1">{getEmailError}</p>}
                                </div>
                                <div>
                                    <input
                                        name="password"
                                        type="password"
                                        onChange={(event) => setPassword(event.target.value)}
                                        value={password}
                                        required
                                        className="bg-gray-100 w-full text-sm px-4 py-3.5 rounded-md outline-blue-600"
                                        placeholder="Password"
                                        autocomplete="current-password"

                                    />
                                    {getPasswordError && <p className="text-[10px] text-red-600 py-1">{getPasswordError}</p>}
                                </div>

                                <p className="py-2 text-sm text-red-600">{loginError}</p>
                                <div className="flex items-center justify-between">

                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            onChange={(e) => setChecked(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor="remember-me"
                                            className="ml-3 block text-sm"
                                        >
                                            Remember me
                                        </label>
                                    </div>

                                    <div
                                        className="text-sm"
                                    >
                                        <a href="#" className="text-blue-600 hover:text-blue-500">
                                            Forgot your password?
                                        </a>
                                    </div>
                                </div>

                                <div className="!mt-10">
                                    {!isLoading ? (
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                        >
                                            Log in
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                        >
                                            Loading...
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
