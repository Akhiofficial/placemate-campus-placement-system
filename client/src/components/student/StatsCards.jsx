import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarCheck, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { getDashboardStats } from "../../api/dashboardApi";

const StatsCards = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then((data) => setStats(data));
  }, []);

  if (!stats) {
    return (
      <p className="text-foreground-muted mb-8 text-sm">
        Loading dashboard statistics…
      </p>
    );
  }

  const cards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: ArrowUpRight,
      bg: "bg-blue-50 dark:bg-blue-500/10",
      iconBg: "bg-blue-100 dark:bg-blue-500/20",
      color: "text-blue-600",
      hint: "↑ 20% this month",
    },
    {
      title: "Interviews Scheduled",
      value: stats.interviewsScheduled,
      icon: CalendarCheck,
      bg: "bg-purple-50 dark:bg-purple-500/10",
      iconBg: "bg-purple-100 dark:bg-purple-500/20",
      color: "text-purple-600",
      hint: "1 upcoming",
    },
    {
      title: "Offers Received",
      value: stats.offersReceived,
      icon: BadgeCheck,
      bg: "bg-green-50 dark:bg-green-500/10",
      iconBg: "bg-green-100 dark:bg-green-500/20",
      color: "text-green-600",
      hint: "Pending review",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map(
        ({ title, value, icon: Icon, bg, iconBg, color, hint }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className={`rounded-2xl p-6 ${bg} border border-border shadow-sm hover:shadow-md transition`}
          >
            <div className="flex justify-between items-start">
              {/* Left */}
              <div>
                <p className="text-sm font-medium text-foreground-muted">
                  {title}
                </p>
                <h3 className="text-3xl font-bold text-foreground mt-1">
                  {value}
                </h3>
                <p className={`text-sm mt-2 ${color}`}>
                  {hint}
                </p>
              </div>

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}
              >
                <Icon className={color} size={22} />
              </div>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
};

export default StatsCards;
