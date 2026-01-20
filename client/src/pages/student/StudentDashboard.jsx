import { useState, useEffect } from "react";
import { getStudentDashboard } from "../../api/dashboardApi";
import { motion } from "framer-motion";
import DashboardHeader from "../../components/student/DashboardHeader";
import StatsCards from "../../components/student/StatsCards";
import RecentApplications from "../../components/student/RecentApplications";
import AcademicProfile from "../../components/student/AcademicProfile";
import RecommendedJobs from "../../components/student/RecommendedJobs";

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getStudentDashboard();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 px-6 py-6 md:px-10 md:py-8 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 px-6 py-6 md:px-10 md:py-8 bg-background">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1 px-6 py-6 md:px-10 md:py-8 bg-background transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <DashboardHeader user={dashboardData?.user} />

        {/* Stats Cards */}
        <StatsCards stats={dashboardData?.stats} />

        {/* Applications + Academic Profile */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <RecentApplications applications={dashboardData?.recentApplications} />
          </div>
          <AcademicProfile profile={dashboardData?.profile} />
        </div>

        {/* Recommended Jobs */}
        <RecommendedJobs jobs={dashboardData?.recommendedJobs} />
      </div>
    </motion.main>
  );
};

export default StudentDashboard;
