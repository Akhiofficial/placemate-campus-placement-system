import React from 'react';

const Input = ({ label, id, type = 'text', placeholder, icon: Icon, error, ...props }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-foreground">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    id={id}
                    type={type}
                    className={`w-full rounded-lg border bg-background-input text-foreground px-3 py-2 text-sm outline-none transition-all placeholder:text-foreground-muted
            ${Icon ? 'pl-10' : ''}
            ${error
                            ? 'border-error ring-2 ring-error/20 focus:border-error focus:ring-error/20'
                            : 'border-border focus:border-ring focus:ring-2 focus:ring-primary/20'
                        }
          `}
                    placeholder={placeholder}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-error">{error}</p>}
        </div>
    );
};

export default Input;
