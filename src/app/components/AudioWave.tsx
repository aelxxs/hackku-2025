import { motion } from "framer-motion";

export const AnimatedAudioWave = ({ animate }: { animate?: boolean }) => {
    const bars = Array.from({ length: 45 }, (_, i) => {
        const randomHeight = () => Math.random() * 75 + 20;
        return (
            <motion.div
                key={i}
                className="w-1 bg-blue-400 rounded"
                initial={{ height: randomHeight() }}
                animate={{ height: randomHeight() }}
                transition={animate ? {
                    duration: Math.random() * 0.1 + 0.4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                } : {}}
            />
        );
    });

    return (
        <div className="flex items-center justify-center w-full h-full gap-1">
            {bars}
        </div>
    );
};
