import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'white' | 'brand';

type ButtonSize = 'default' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: ButtonVariant;
    size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
    white: 'bg-white text-[var(--fg-brand)] hover:bg-[var(--neutral-tertiary)]',
    brand:
        'bg-[var(--brand)] text-[var(--on-brand)] hover:bg-[var(--brand-strong)]',
};

const sizeStyles: Record<ButtonSize, string> = {
    default: 'px-6 py-4 text-base',
    large: 'px-10 py-5 text-xl',
};

export default function Button({
    variant,
    size = 'default',
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 font-medium leading-none no-underline transition-[background-color] duration-150 ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'cursor-not-allowed opacity-50 text-[var(--fg-disabled)]' : 'cursor-pointer'} ${className}`}
            disabled={disabled}
            {...props}
        />
    );
}
