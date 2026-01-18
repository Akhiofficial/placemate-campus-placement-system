import { motion } from "framer-motion";
import DashboardHeader from "../../components/student/DashboardHeader";
import StatsCards from "../../components/student/StatsCards";
import RecentApplications from "../../components/student/RecentApplications";
import AcademicProfile from "../../components/student/AcademicProfile";
import RecommendedJobs from "../../components/student/RecommendedJobs";

const StudentDashboard = () => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1 px-6 py-6 md:px-10 md:py-8 bg-background transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <DashboardHeader />

        {/* Stats Cards */}
        <StatsCards />

        {/* Applications + Academic Profile */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <RecentApplications />
          </div>
          <AcademicProfile />
        </div>

        {/* Recommended Jobs */}
        <RecommendedJobs />
      </div>
    </motion.main>
  );
};

export default StudentDashboard;
