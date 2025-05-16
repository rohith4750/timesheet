import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { getTasks, TaskData } from "../../api/taskApi";
import { BarChart, PieChart } from "../../components/analytics";
import "./home-page.scss";

const HomePage: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [30, 40, 35, 50, 49, 60],
  });

  const [statusData, setStatusData] = useState({
    labels: ["Pending", "In Progress", "Completed", "Cancelled"],
    values: [25, 30, 35, 10],
  });

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await getTasks(1, 100);
        // Process data for charts here
        // This is a placeholder for actual data processing
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchTaskData();
  }, []);

  return (
    <div className="analytics-dashboard">
      <Typography variant="h4" gutterBottom>
        Task Analytics Dashboard
      </Typography>
      <div className="dashboard-grid">
        <div className="dashboard-grid-item dashboard-grid-item--large">
          <BarChart
            title="Monthly Task Completion"
            data={monthlyData}
            xAxisTitle="Month"
            yAxisTitle="Tasks Completed"
          />
        </div>
        <div className="dashboard-grid-item dashboard-grid-item--small">
          <PieChart
            title="Tasks by Status"
            data={statusData}
            enableLegend={true}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
