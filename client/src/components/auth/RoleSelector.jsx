import React from 'react';

const RoleSelector = ({ selectedRole, onSelect }) => {
    const roles = [
        { id: 'student', label: 'Student' },
        { id: 'company', label: 'Company' },
        { id: 'admin', label: 'Admin' }
    ];

    return (
        <div className="bg-background-muted p-1 rounded-xl flex gap-1 mb-6">
            {roles.map((role) => (
                <button
                    key={role.id}
                    onClick={() => onSelect(role.id)}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
            ${selectedRole === role.id
                            ? 'bg-background text-primary shadow-sm'
                            : 'text-foreground-muted hover:text-foreground'
                        }
          `}
                >
                    {role.label}
                </button>
            ))}
        </div>
    );
};

export default RoleSelector;
