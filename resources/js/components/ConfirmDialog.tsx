import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'default';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Konfirmasi',
    cancelLabel = 'Batal',
    variant = 'default',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={onCancel}
                    />

                    <motion.div
                        className="relative mx-4 w-full max-w-sm border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="mb-4 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                {variant === 'danger' && (
                                    <div className="flex size-10 items-center justify-center bg-[var(--danger-soft)]">
                                        <AlertTriangle
                                            size={20}
                                            className="text-[var(--fg-danger-strong)]"
                                        />
                                    </div>
                                )}
                                <h3 className="text-base font-bold text-[var(--heading)]">
                                    {title}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex size-8 cursor-pointer items-center justify-center border-none bg-transparent text-[var(--body-subtle)] transition-colors hover:text-[var(--heading)]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <p className="mb-6 text-sm text-[var(--body)]">
                            {message}
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="cursor-pointer border border-[var(--border-default)] px-4 py-2.5 text-sm font-medium text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                className={`cursor-pointer px-4 py-2.5 text-sm font-medium text-white transition-colors ${
                                    variant === 'danger'
                                        ? 'bg-[var(--fg-danger)] hover:opacity-90'
                                        : 'bg-[var(--brand)] hover:bg-[var(--brand-strong)]'
                                }`}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
