import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const NODE_API = import.meta.env.VITE_NODE_API;

    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            toast.error('Please enter both email and password');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${NODE_API}/auth/login`, formData);
            const { user, token } = response.data;

            toast.success('Login successful');

            // Store user and token in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            setUser(user);
            navigate('/profile');
        } catch (error) {
            toast.error('Login failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } }
    };

    const formVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15, delay: 0.2 } }
    };

    const buttonVariants = {
        hover: { scale: 1.03, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" },
        tap: { scale: 0.97 }
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-purple-100 p-4 w-lvw"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <ToastContainer position="top-right" autoClose={3000} />

            <motion.div
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-800">Welcome Back</h2>
                        <p className="text-gray-600 mt-2">Log in to continue your learning journey</p>
                    </div>

                    <div className="space-y-6">
                        <div className="relative">
                            <input
                                type="email"
                                placeholder=" "
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors peer pt-6"
                                required
                            />
                            <label className="absolute left-4 top-4 text-gray-500 transition-all peer-focus:text-sm peer-focus:top-2 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-[&:not(:placeholder-shown)]:text-sm peer-[&:not(:placeholder-shown)]:top-2 peer-focus:-translate-y-2 pointer-events-none">
                                Email Address
                            </label>
                            <div className="absolute right-4 top-4 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder=" "
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors peer pt-6"
                                required
                            />
                            <label className="absolute left-4 top-4 text-gray-500 transition-all peer-focus:text-sm peer-focus:top-2 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-[&:not(:placeholder-shown)]:text-sm peer-[&:not(:placeholder-shown)]:top-2 peer-focus:-translate-y-2 pointer-events-none">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <a href="#" className="text-blue-600 hover:text-blue-800">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <motion.button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold flex items-center justify-center"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    Login
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </motion.button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <motion.a
                                href="/register"
                                className="text-blue-600 font-medium hover:text-blue-800"
                                whileHover={{ scale: 1.05 }}
                            >
                                Sign up
                            </motion.a>
                        </p>
                    </div>

                    <motion.div
                        className="mt-12 p-4 bg-blue-50 rounded-lg border border-blue-100"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <p className="text-sm text-center text-blue-800">
                            This learning platform provides immersive content and interactive experiences for students and teachers.
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Login;