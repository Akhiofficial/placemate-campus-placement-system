
import { ArrowRight } from "lucide-react";
import JobCard from "../ui/JobCard";
import { useNavigate } from "react-router-dom";

const RecommendedJobs = ({ jobs = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-foreground">
          Recommended for you
        </h2>

        <button
          onClick={() => navigate('/student/jobs')}
          className="hidden md:flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline cursor-pointer"
        >
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Cards */}
      <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <JobCard key={job._id || index} job={job} index={index} />
          ))
        ) : (
          <p className="col-span-4 text-center text-foreground-muted py-8">No recommended jobs available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default RecommendedJobs;
