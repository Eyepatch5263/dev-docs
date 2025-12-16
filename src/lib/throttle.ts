/**
 * Throttle function that limits how often a function can be called
 * @param func - Function to throttle
 * @param delay - Minimum time between calls in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let lastCall = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    return function (this: any, ...args: Parameters<T>) {
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;

        if (timeSinceLastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        } else {
            // Clear existing timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            // Schedule function to run after delay
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                func.apply(this, args);
                timeoutId = null;
            }, delay - timeSinceLastCall);
        }
    };
}

/**
 * Debounce function that delays execution until after delay has elapsed since last call
 * @param func - Function to debounce
 * @param delay - Time to wait after last call
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return function (this: any, ...args: Parameters<T>) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
        }, delay);
    };
}
