import React, { useState } from 'react';
import { X, User, Target, Calendar, Award, Sparkles, LogOut, Save, ChevronRight } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType;
    onUpdate: (updatedUser: UserType) => void;
    onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onUpdate, onLogout }) => {
    const [name, setName] = useState(user.name);
    const [targetBand, setTargetBand] = useState(user.targetBand);
    const [examDate, setExamDate] = useState(user.examDate || '');

    if (!isOpen) return null;

    const handleSave = () => {
        onUpdate({
            ...user,
            name,
            targetBand,
            examDate
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white/80 backdrop-blur-3xl border border-white/60 rounded-[3.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="relative p-8 sm:p-12 -mt-16">
                    {/* Avatar & Close */}
                    <div className="flex items-end justify-between mb-10">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1 shadow-2xl overflow-hidden">
                                <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-slate-50 border border-slate-100 italic flex items-center justify-center">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="avatar" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 border-4 border-white text-white p-2 rounded-2xl shadow-lg">
                                <Sparkles className="w-4 h-4" />
                            </div>
                        </div>

                        <button onClick={onClose} className="p-3 bg-white/50 backdrop-blur-md border border-white hover:bg-white rounded-full transition-all text-slate-400 hover:shadow-lg">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left Side: General Info */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-4">Identity Profile</h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                                        <Calendar className="w-5 h-5 text-indigo-500" />
                                        <div>
                                            <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Academy Member Since</p>
                                            <p className="text-sm font-bold text-indigo-900">{new Date(user.joinedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-4">Exam Timeline</h3>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={examDate}
                                        onChange={(e) => setExamDate(e.target.value)}
                                        className="w-full px-5 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
                                    />
                                    {!examDate && <p className="mt-2 text-[0.65rem] text-slate-400 italic font-medium">Add your exam date to see countdown in dashboard.</p>}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Ambition & Metrics */}
                        <div className="space-y-6">
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/40 transition-all duration-700" />

                                <div className="flex items-center gap-3 mb-6">
                                    <Target className="w-5 h-5 text-indigo-400" />
                                    <h3 className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em]">Personal Ambition</h3>
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-4xl font-black tracking-tighter">Band {targetBand}</span>
                                    <Award className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                                </div>

                                <input
                                    type="range"
                                    min="4.0"
                                    max="9.0"
                                    step="0.5"
                                    value={targetBand}
                                    onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400 mb-4"
                                />

                                <p className="text-[0.65rem] text-slate-400 font-medium leading-relaxed">
                                    Examiner Aya will adapt her feedback strictness based on this goal.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleSave}
                                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
                                >
                                    <Save className="w-5 h-5" />
                                    Commit Changes
                                </button>
                                <button
                                    onClick={onLogout}
                                    className="w-full bg-slate-100 text-slate-400 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-[0.98]"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
