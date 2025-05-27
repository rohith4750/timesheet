import React, { useEffect, useState } from "react";
import { getTasks, TaskData } from "../../api/taskApi";
//import { BarChart, PieChart } from "../../components/analytics";
import { BarChart, PieChart } from "../../components/analytics";
import Card from "../../components/card/card";
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

  const [priorityData, setPriorityData] = useState({
    labels: ["High", "Medium", "Low"],
    values: [40, 35, 25],
  });

  const [dashboardStats, setDashboardStats] = useState({
    totalTasks: 0,
    totalProjects: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getTasks(1, 100);
        // Process data for charts here
        setDashboardStats({
          totalTasks: response.data.length || 0,
          totalProjects: 15, // Replace with actual API call
          totalUsers: 25, // Replace with actual API call
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="analytics-dashboard">
      <h2 className="dashboard-title">Analytics Dashboard</h2>

      <div className="stats-cards">
        <div className="stats-card-item">
          <Card
            heading="Total Tasks"
            value={dashboardStats.totalTasks}
            info="Assigned tasks across all projects"
            type="c2"
          />
        </div>
        <div className="stats-card-item">
          <Card
            heading="Active Projects"
            value={dashboardStats.totalProjects}
            info="Currently running projects"
            type="c2"
          />
        </div>
        <div className="stats-card-item">
          <Card
            heading="Total Users"
            value={dashboardStats.totalUsers}
            info="Registered system users"
            type="c2"
          />
        </div>
      </div>
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
        <div className="dashboard-grid-item dashboard-grid-item--small">
          <PieChart
            title="Tasks by Priority"
            data={priorityData}
            enableLegend={true}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
