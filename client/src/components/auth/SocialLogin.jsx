import React from 'react';

const SocialLogin = ({ role = 'student' }) => {
    const [error, setError] = React.useState('');

    const handleGoogleLogin = () => {
        if (role === 'admin') {
            setError('Admins cannot sign in/up with Google. Please use email and password.');
            return;
        }
        setError('');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        window.location.href = `${apiUrl}/auth/google?role=${role}`;
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded text-center">
                    {error}
                </div>
            )}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-foreground-muted">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg md:hover:bg-background-muted transition-colors bg-background"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.534 55.179 -9.444 56.409 -10.744 57.269 L -10.744 60.159 L -6.824 60.159 C -4.534 58.059 -3.264 54.919 -3.264 51.509 Z" />
                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.169 L -10.744 57.279 C -11.814 58.009 -13.184 58.429 -14.754 58.429 C -17.894 58.429 -20.554 56.289 -21.494 53.379 L -25.274 53.379 L -25.274 56.329 C -23.414 60.039 -19.464 63.239 -14.754 63.239 Z" />
                            <path fill="#FBBC05" d="M -21.494 53.379 C -21.734 52.629 -21.874 51.849 -21.874 51.029 C -21.874 50.199 -21.744 49.409 -21.494 48.659 L -21.494 45.729 L -25.264 45.729 C -26.044 47.289 -26.494 49.099 -26.494 51.029 C -26.494 52.969 -26.034 54.769 -25.274 56.329 L -21.494 53.379 Z" />
                            <path fill="#EA4335" d="M -14.754 43.609 C -12.984 43.609 -11.414 44.229 -10.164 45.419 L -6.744 41.989 C -8.804 40.059 -11.514 38.839 -14.754 38.839 C -19.464 38.839 -23.414 42.049 -25.264 45.729 L -21.494 48.659 C -20.554 45.729 -17.894 43.609 -14.754 43.609 Z" />
                        </g>
                    </svg>
                    <span className="text-sm font-medium text-foreground">Google</span>
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;
