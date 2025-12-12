import { useEffect } from 'react';

interface KeyboardControls {
    onSpace?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onKeyS?: () => void;
    onKeyK?: () => void;
    onKeyR?: () => void;
}

export function useKeyboardControls({
    onSpace,
    onArrowLeft,
    onArrowRight,
    onKeyS,
    onKeyK,
    onKeyR,
}: KeyboardControls) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if user is typing in an input
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (event.key) {
                case ' ':
                    event.preventDefault();
                    onSpace?.();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    onArrowLeft?.();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    onArrowRight?.();
                    break;
                case 's':
                case 'S':
                    event.preventDefault();
                    onKeyS?.();
                    break;
                case 'k':
                case 'K':
                    event.preventDefault();
                    onKeyK?.();
                    break;
                case 'r':
                case 'R':
                    event.preventDefault();
                    onKeyR?.();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSpace, onArrowLeft, onArrowRight, onKeyS, onKeyK, onKeyR]);
}
