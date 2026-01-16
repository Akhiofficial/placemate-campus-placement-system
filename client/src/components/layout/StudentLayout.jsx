import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import StudentSidebar from "../ui/StudentSidebar";

const StudentLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background transition-colors duration-300">
            {/* Sidebar */}
            <StudentSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Mobile Header */}
                <header className="md:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-foreground-muted hover:bg-background-muted rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-blue-600 text-lg">PlaceMate</span>
                    </div>

                    {/* You could add a small profile or notification icon here for mobile */}
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        A
                    </div>
                </header>

                {/* Page Content */}
                <Outlet />
            </div>
        </div>
    );
};

export default StudentLayout;
