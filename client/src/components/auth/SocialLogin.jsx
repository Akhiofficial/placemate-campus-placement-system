import React from 'react';

const SocialLogin = ({ role = 'student' }) => {
    const [error, setError] = React.useState('');

    const handleGoogleLogin = () => {
        if (role === 'admin') {
            setError('Admins cannot sign in/up with Google. Please use email and password.');
            return;
        }
        setError('');
        window.location.href = `http://localhost:5000/api/auth/google?role=${role}`;
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
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                    <span className="text-sm font-medium text-foreground">Google</span>
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;
