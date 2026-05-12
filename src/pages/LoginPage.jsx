import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Email dan password wajib diisi');
            return;
        }
        if (email !== 'admin@crm.com' || password !== 'admin123') {
            setError('Email atau password salah');
            return;
        }
        setError('');
        setIsLoading(true);

        // Simulasi loading
        setTimeout(() => {
            setIsLoading(false);
            setShowOtp(true);
        }, 800);
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Masukkan 6 digit OTP');
            return;
        }
        if (otpCode !== '123456') {
            setError('Kode OTP salah');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onLogin({ email, name: 'Admin CRM', role: 'Super Admin', avatar: 'AD' });
        }, 800);
    };

    const handleBackToLogin = () => {
        setShowOtp(false);
        setOtp(['', '', '', '', '', '']);
        setError('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Floating shapes */}
            <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-2xl rotate-12 animate-float"></div>
            <div className="absolute bottom-20 right-10 w-12 h-12 bg-white/10 rounded-full animate-float-delay"></div>
            <div className="absolute top-40 right-20 w-8 h-8 bg-purple-300/20 rounded-lg rotate-45 animate-float"></div>

            {/* Login Card */}
            <div className="relative m-6 z-10 w-[440px] bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl shadow-lg mb-4">
                        <span className="text-2xl font-bold text-white">CRM</span>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                        Selamat Datang Kembali
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">Masuk ke akun CRM Anda</p>
                </div>

                {/* Demo Info - Modern Style */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl mb-6 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">DEMO</span>
                        <span className="text-xs text-gray-500">Akses demo</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-gray-500">📧 Email:</span>
                            <p className="font-mono text-indigo-600 font-medium">admin@crm.com</p>
                        </div>
                        <div>
                            <span className="text-gray-500">🔑 Password:</span>
                            <p className="font-mono text-indigo-600 font-medium">admin123</p>
                        </div>
                        <div className="col-span-2">
                            <span className="text-gray-500">🔢 OTP:</span>
                            <p className="font-mono text-indigo-600 font-medium">123456</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mb-4 animate-shake">
                        <div className="flex items-center gap-2">
                            <span className="text-red-500">⚠️</span>
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {!showOtp ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Memproses...</span>
                                </div>
                            ) : (
                                <span>Login →</span>
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            Sistem manajemen CRM terintegrasi
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-lg mb-3">
                                <span className="text-2xl">🔐</span>
                            </div>
                            <p className="text-gray-700 font-medium">Verifikasi Dua Langkah</p>
                            <p className="text-gray-400 text-xs mt-1">Masukkan kode OTP yang dikirim ke email Anda</p>
                        </div>

                        <div className="grid grid-cols-6 gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    className="aspect-square text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl text-indigo-600 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Memverifikasi...</span>
                                </div>
                            ) : (
                                <span>Verifikasi & Masuk →</span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="w-full py-2 text-gray-500 text-sm hover:text-indigo-600 transition-colors flex items-center justify-center gap-1"
                        >
                            ← Kembali ke Login
                        </button>
                    </form>
                )}

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                        © 2024 BlazCRM. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Style untuk animasi */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 5s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
        </div>
    );
};

export default LoginPage;