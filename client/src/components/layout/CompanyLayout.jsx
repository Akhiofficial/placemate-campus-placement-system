import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import CompanySidebar from "../company/CompanySidebar";
import { getMe } from "../../api/authApi";

const CompanyLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const { data } = await getMe();
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="flex min-h-screen bg-background transition-colors duration-300 text-foreground font-sans">
            <CompanySidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-background transition-colors duration-300">

                {/* Mobile Header */}
                <header className="md:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-foreground-muted hover:bg-background-muted rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-blue-600 text-lg">PlaceMate</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border-2 border-white dark:border-gray-800 overflow-hidden">
                        {user?.name ? (
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            "U"
                        )}
                    </div>
                </header>

                {/* Page Content wrapper with overflow handling */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
                    <Outlet context={{ user, refreshUser: fetchUser }} />
                </main>
            </div>
        </div>
    );
};

export default CompanyLayout;
