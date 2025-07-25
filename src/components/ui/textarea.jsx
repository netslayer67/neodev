// src/components/ui/textarea.jsx
import React from 'react';

export const Textarea = React.forwardRef(({ className = '', ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={`w-full p-3 rounded-xl border border-white/10 bg-white/10 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 ${className}`}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';
