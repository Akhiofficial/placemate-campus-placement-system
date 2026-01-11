import React from 'react';

const SocialLogin = () => {
    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-foreground-muted">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg md:hover:bg-background-muted transition-colors bg-background">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                    <span className="text-sm font-medium text-foreground">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg md:hover:bg-background-muted transition-colors bg-background">
                    <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="h-5 w-5" alt="LinkedIn" />
                    <span className="text-sm font-medium text-foreground">LinkedIn</span>
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;
