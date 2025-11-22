import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "brand" | "black" | "gray" | "success" | "error" | "warning";
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
  xl: "h-12 w-12 border-4",
};

const colorClasses = {
  brand: "border-brand-200 border-t-brand-600 dark:border-brand-800 dark:border-t-brand-400",
  black: "border-black/30 border-t-black dark:border-white/70 dark:border-t-white",
  gray: "border-gray-200 border-t-gray-600 dark:border-gray-700 dark:border-t-gray-300",
  success: "border-success-200 border-t-success-600 dark:border-success-800 dark:border-t-success-400",
  error: "border-error-200 border-t-error-600 dark:border-error-800 dark:border-t-error-400",
  warning: "border-warning-200 border-t-warning-600 dark:border-warning-800 dark:border-t-warning-400",
};

export default function Spinner({
  size = "md",
  className,
  color = "brand",
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block rounded-full animate-spin",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Loading overlay component for full-page loading
interface LoadingOverlayProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function LoadingOverlay({ message, size = "lg" }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-xl bg-white dark:bg-gray-dark p-6 shadow-theme-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center gap-4">
        <Spinner size={size} />
        {message && (
          <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// Loading container for inline loading states
interface LoadingContainerProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  spinnerSize?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LoadingContainer({
  isLoading,
  children,
  loadingText = "Loading...",
  spinnerSize = "md",
  className,
}: LoadingContainerProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-8", className)}>
      <Spinner size={spinnerSize} />
      <p className="text-theme-sm text-gray-500 dark:text-gray-400">{loadingText}</p>
    </div>
  );
}

// Button spinner for loading buttons
interface ButtonSpinnerProps {
  className?: string;
}

export function ButtonSpinner({ className }: ButtonSpinnerProps) {
  return (
    <Spinner
      size="sm"
      color="black"
      className={cn("mr-2", className)}
    />
  );
}