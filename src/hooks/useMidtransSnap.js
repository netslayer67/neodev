import { useEffect, useState } from "react";

export function useMidtransSnap() {
    const [isLoaded, setIsLoaded] = useState(false);
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    useEffect(() => {
        // Cek kalau udah ada, jangan inject lagi
        if (window.snap) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", clientKey);
        script.async = true;

        script.onload = () => setIsLoaded(true);
        script.onerror = () => console.error("Failed to load Midtrans Snap.js");

        document.body.appendChild(script);

        return () => {
            // optional: clean up kalau mau strict
            document.body.removeChild(script);
        };
    }, [clientKey]);

    return { isLoaded };
}
