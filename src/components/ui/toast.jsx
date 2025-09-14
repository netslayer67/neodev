import { cn } from '@/lib/utils'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva } from 'class-variance-authority'
import { X } from 'lucide-react'
import React from 'react'

const ToastProvider = ToastPrimitives.Provider

/* -------- Viewport -------- */
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			// Layout → top center stack
			'fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 p-4 sm:p-6',
			'w-full max-w-[420px]',
			'pointer-events-none',
			className
		)}
		{...props}
	/>
))

ToastViewport.displayName = ToastPrimitives.Viewport.displayName

/* -------- Variants -------- */
const toastVariants = cva(
	'group relative pointer-events-auto flex w-full items-start gap-3 rounded-2xl border p-4 sm:p-5',
	'backdrop-blur-xl transition-all duration-320 ease-out shadow-lg',
	{
		variants: {
			variant: {
				default: 'bg-card/70 border-border text-foreground',
				success: 'bg-success/80 border-success text-success-foreground',
				info: 'bg-info/80 border-info text-info-foreground',
				destructive: 'bg-error/80 border-error text-error-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

/* -------- Root -------- */
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => (
	<ToastPrimitives.Root
		ref={ref}
		className={cn(
			toastVariants({ variant }),
			// Radix animation hooks
			'data-[state=open]:animate-in data-[state=closed]:animate-out',
			'data-[state=open]:slide-in-from-bottom-full sm:data-[state=open]:slide-in-from-right-full',
			'data-[state=closed]:slide-out-to-right-full',
			className
		)}
		{...props}
	/>
))
Toast.displayName = ToastPrimitives.Root.displayName

/* -------- Action -------- */
const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			'inline-flex shrink-0 items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium',
			'border border-border/40 bg-transparent hover:bg-secondary transition-colors duration-320',
			'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
			'disabled:pointer-events-none disabled:opacity-50',
			'group-[.destructive]:hover:bg-error/20 group-[.destructive]:focus:ring-error',
			className
		)}
		{...props}
	/>
))
ToastAction.displayName = ToastPrimitives.Action.displayName

/* -------- Close -------- */
const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			'absolute right-3 top-3 rounded-full p-1.5',
			'text-foreground/50 hover:text-foreground transition-colors duration-320',
			'focus:outline-none focus:ring-2 focus:ring-accent group-[.destructive]:hover:text-error-foreground',
			className
		)}
		toast-close=""
		{...props}
	>
		<X className="h-4 w-4" />
	</ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

/* -------- Title -------- */
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn('text-sm font-semibold tracking-tight', className)}
		{...props}
	/>
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

/* -------- Description -------- */
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn('text-sm text-muted-foreground', className)}
		{...props}
	/>
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

/* -------- Exports -------- */
export {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
}
