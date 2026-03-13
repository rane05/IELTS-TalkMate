import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck, Github, Chrome, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { authService } from '../services/api';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [targetBand, setTargetBand] = useState(7.5);

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                const data = await authService.login({ email, password });
                onLogin(data.user);
            } else {
                const data = await authService.register({ name, email, password, targetBand });
                onLogin(data.user);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Is the server running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Canvas */}
            <div className="relative w-full max-w-lg bg-white/70 backdrop-blur-3xl border border-white/60 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

                <div className="relative p-8 sm:p-12">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6 rotate-3">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            Join the elite circle of band 9 achievers.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-4">
                                    <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Target Band Score</label>
                                    <span className="text-xl font-black text-indigo-600">Band {targetBand}</span>
                                </div>
                                <div className="px-4">
                                    <input
                                        type="range"
                                        min="4.0"
                                        max="9.0"
                                        step="0.5"
                                        value={targetBand}
                                        onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex justify-between mt-2 text-[0.5rem] font-black text-slate-300 uppercase tracking-tighter">
                                        <span>4.0</span>
                                        <span>5.0</span>
                                        <span>6.0</span>
                                        <span>7.0</span>
                                        <span>8.0</span>
                                        <span>9.0</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 text-rose-500" />
                                <p className="text-xs font-bold text-rose-600">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-indigo-600 shadow-indigo-100'} text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg`}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Profile'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Social Auth */}
                    <div className="mt-8">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-slate-400 bg-transparent px-4">
                                <span className="bg-white/70 px-4 rounded-full">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700 active:scale-95">
                                <Chrome className="w-4 h-4" />
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700 active:scale-95">
                                <Github className="w-4 h-4" />
                                GitHub
                            </button>
                        </div>
                    </div>

                    {/* Footer Toggle */}
                    <div className="mt-10 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-500 font-medium hover:text-indigo-600 transition-colors"
                        >
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <span className="font-bold underline decoration-indigo-200 underline-offset-4 decoration-2">
                                {isLogin ? 'Sign up free' : 'Log in here'}
                            </span>
                        </button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        Military grade encryption active
                    </div>
                </div>
            </div>
        </div>
    );
};
