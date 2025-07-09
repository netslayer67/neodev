import * as TabsPrimitive from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const Tabs = ({ children, ...props }) => {
    return <TabsPrimitive.Root {...props}>{children}</TabsPrimitive.Root>;
};

export const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={clsx(
            'inline-flex items-center justify-center rounded-xl bg-white/5 p-1 backdrop-blur-md border border-white/10',
            className
        )}
        {...props}
    />
));

export const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={clsx(
            'px-5 py-2 rounded-lg text-sm font-medium transition-all',
            'data-[state=active]:bg-white data-[state=active]:text-black',
            'text-neutral-300 hover:text-white hover:bg-white/10',
            className
        )}
        {...props}
    />
));

export const TabsContent = ({ value, children, forceMount, ...props }) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <TabsPrimitive.Content value={value} forceMount={forceMount} asChild {...props}>
            {mounted && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={value}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            )}
        </TabsPrimitive.Content>
    );
};
