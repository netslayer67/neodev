// src/components/ui/Dialog.jsx
import React from "react";

export function Dialog({ open, onOpenChange, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-lg border border-border">
                {children}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export function DialogContent({ children }) {
    return <div className="relative">{children}</div>;
}

export function DialogHeader({ children }) {
    return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
    return <h2 className="text-lg font-bold">{children}</h2>;
}
