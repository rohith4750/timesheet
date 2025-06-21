import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/toast/ToastContext";
import { TaskData } from "../../api/taskApi";
import { getDashboardStats, getRecentTasks, DashboardStats } from "../../api/dashboardApi";
import { permissionAccess } from "../../hooks/permissionAccess";
import { PERMISSIONS } from "../../constants/permissions";
import "./home-page.scss";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user has permission to view tasks
        if (!permissionAccess(PERMISSIONS.VIEW_TASK)) {
          showToast({
            type: "error",
            message: "You don't have permission to view tasks.",
            duration: 5000
          });
          return;
        }

        console.log('Starting to fetch dashboard data...');
        
        // Fetch both dashboard stats and recent tasks in parallel
        const [statsResponse, tasksResponse] = await Promise.all([
          getDashboardStats(),
          getRecentTasks()
        ]);

        console.log('Dashboard stats response:', statsResponse);
        console.log('Recent tasks response:', tasksResponse);

        setStats(statsResponse);
        setTasks(tasksResponse.tasks || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Log more detailed error information
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        showToast({
          type: "error",
          message: "Failed to load dashboard data. Please try again.",
          duration: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <h1>Dashboard</h1>
      
      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{stats?.totalTasks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Projects</h3>
          <p>{stats?.totalProjects || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats?.totalUsers || 0}</p>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="recent-tasks">
        <h2>Recent Tasks</h2>
        {tasks.length > 0 ? (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.ut_sno} className="task-card">
                <h3>{task.task_name}</h3>
                <p>{task.task_description}</p>
                <div className="task-meta">
                  <span className={`status ${(task.task_status || '').toLowerCase()}`}>
                    {task.task_status || 'Unknown'}
                  </span>
                  <span className="hours">{task.no_of_hours || 0} hours</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
