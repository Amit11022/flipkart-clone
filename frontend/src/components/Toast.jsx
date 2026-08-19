import { useState, useEffect, useCallback } from "react";

// ========================================
// TOAST CONTEXT & HOOK
// ========================================

let toastQueue = [];
let toastListeners = [];

const notifyListeners = () => {
    toastListeners.forEach(fn => fn([...toastQueue]));
};

export const toast = {
    success: (message, duration = 3500) => addToast(message, "success", duration),
    error:   (message, duration = 4000) => addToast(message, "error",   duration),
    info:    (message, duration = 3000) => addToast(message, "info",    duration),
    warning: (message, duration = 3500) => addToast(message, "warning", duration),
};

function addToast(message, type, duration) {
    const id = Date.now() + Math.random();
    toastQueue = [...toastQueue, { id, message, type, duration }];
    notifyListeners();

    setTimeout(() => {
        removeToast(id);
    }, duration);
}

function removeToast(id) {
    toastQueue = toastQueue.filter(t => t.id !== id);
    notifyListeners();
}

// ========================================
// TOAST CONTAINER COMPONENT
// ========================================

function Toast() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const listener = (newToasts) => setToasts(newToasts);
        toastListeners.push(listener);
        return () => {
            toastListeners = toastListeners.filter(fn => fn !== listener);
        };
    }, []);

    const handleClose = useCallback((id) => {
        removeToast(id);
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container" aria-live="polite">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`toast toast-${t.type}`}
                    role="alert"
                >
                    <span className="toast-icon">
                        {t.type === "success" && "✓"}
                        {t.type === "error"   && "✕"}
                        {t.type === "warning" && "⚠"}
                        {t.type === "info"    && "ℹ"}
                    </span>
                    <span className="toast-message">{t.message}</span>
                    <button
                        className="toast-close"
                        onClick={() => handleClose(t.id)}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Toast;
