"use client"

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 300);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 flex flex-col items-center justify-center z-50">
            {/* Logo */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="bg-white rounded-full p-8 shadow-2xl">
                    <Car className="w-24 h-24 text-yellow-500" strokeWidth={2.5} />
                </div>
            </motion.div>

            {/* Brand Name */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
                    SmarthRides
                </h1>
                <p className="text-xl font-bold text-white/90">
                    Aapla Shehar, Aapli Auto
                </p>
            </motion.div>

            {/* Loading Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-64"
            >
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>
                <p className="text-white/80 text-sm text-center mt-3 font-semibold">
                    Loading... {progress}%
                </p>
            </motion.div>
        </div>
    );
}
