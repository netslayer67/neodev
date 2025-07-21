// FluidBackground.jsx
import { useEffect, useRef } from "react";

const FluidBackground = () => {
    const canvasRef = useRef();

    useEffect(() => {
        if (window && window.initFluidSimulation) {
            window.initFluidSimulation(canvasRef.current, {
                SIM_RESOLUTION: 128,
                DYE_RESOLUTION: 512,
                DENSITY_DISSIPATION: 0.97,
                VELOCITY_DISSIPATION: 0.99,
                PRESSURE: 0.8,
                CURL: 30,
                SPLAT_RADIUS: 0.35,
                COLORS: ["#ffffff", "#a3e635", "#38bdf8"],
            });
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-5"
        />
    );
};

export default FluidBackground;
