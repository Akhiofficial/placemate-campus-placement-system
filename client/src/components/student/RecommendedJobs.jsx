import { ArrowRight } from "lucide-react";
import JobCard from "../ui/JobCard";

const jobs = [
  {
    role: "UX Designer",
    company: "Uber",
    location: "San Francisco",
    logo: "U",
    logoBg: "bg-black",
  },
  {
    role: "Backend Engineer",
    company: "Google",
    location: "Remote",
    logo: "G",
    logoBg: "bg-blue-600",
  },
  {
    role: "iOS Developer",
    company: "Instagram",
    location: "New York",
    logo: "I",
    logoBg: "bg-pink-500",
  },
  {
    role: "Cloud Architect",
    company: "Amazon",
    location: "Seattle",
    logo: "A",
    logoBg: "bg-orange-500",
  },
];

const RecommendedJobs = () => {
  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-foreground">
          Recommended for you
        </h2>

        <button className="hidden md:flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline cursor-pointer">
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Cards */}
      <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} index={index} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobs;
