"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Shield, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingProps {
    onComplete: () => void;
    onSkip: () => void;
}

const slides = [
    {
        icon: Car,
        title: "Local Autos. Fixed Fares.",
        description: "No surge pricing. No hidden charges. What you see is what you pay.",
        color: "from-yellow-400 to-orange-500"
    },
    {
        icon: Shield,
        title: "Verified Drivers from Your Area",
        description: "All drivers are locally verified and background checked for your safety.",
        color: "from-orange-500 to-red-500"
    },
    {
        icon: MapPin,
        title: "SOS & Live Tracking",
        description: "Share your ride with family. Emergency SOS button always available.",
        color: "from-red-500 to-pink-500"
    }
];

export default function OnboardingScreen({ onComplete, onSkip }: OnboardingProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const slide = slides[currentSlide];
    const Icon = slide.icon;

    return (
        <div className="fixed inset-0 bg-slate-950 flex flex-col z-50">
            {/* Skip Button */}
            <div className="absolute top-6 right-6 z-10">
                <Button
                    onClick={onSkip}
                    variant="ghost"
                    className="text-white/70 hover:text-white text-lg font-bold px-8 py-6"
                >
                    SKIP
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="text-center max-w-md"
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                            className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${slide.color} mb-12 shadow-2xl`}
                        >
                            <Icon className="w-16 h-16 text-white" strokeWidth={2.5} />
                        </motion.div>

                        {/* Title */}
                        <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                            {slide.title}
                        </h2>

                        {/* Description */}
                        <p className="text-xl text-slate-400 leading-relaxed">
                            {slide.description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <div className="p-8 space-y-6">
                {/* Dots Indicator */}
                <div className="flex justify-center gap-2">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'w-8 bg-yellow-500'
                                    : 'w-2 bg-slate-700'
                                }`}
                        />
                    ))}
                </div>

                {/* Next Button */}
                <Button
                    onClick={handleNext}
                    className="w-full h-16 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-xl rounded-2xl shadow-xl hover:shadow-yellow-500/20 transition-all"
                >
                    {currentSlide === slides.length - 1 ? "GET STARTED" : "NEXT"}
                    <ChevronRight className="ml-2 w-6 h-6" />
                </Button>
            </div>
        </div>
    );
}
