export const getDashboardStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalApplications: 12,
        interviewsScheduled: 3,
        offersReceived: 1,
      });
    }, 500); // simulate API delay
  });
};
