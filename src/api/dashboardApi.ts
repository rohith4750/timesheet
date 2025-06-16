import { api } from './config';
import { TaskData } from './taskApi';

export interface DashboardStats {
  totalTasks: number;
  totalProjects: number;
  totalUsers: number;
}

export interface DashboardResponse {
  success: boolean;
  data: {
    dashboardStats: DashboardStats;
    monthlyData: any[];
    statusData: any[];
    priorityData: any[];
  };
}

export interface RecentTasksResponse {
  tasks: TaskData[];
  total: number;
}

// Get dashboard stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    console.log('Fetching dashboard stats...');
    const response = await api.get<DashboardResponse>('/dashboard/stats');
    console.log('Dashboard stats response:', response.data);
    
    if (!response.data?.data?.dashboardStats) {
      throw new Error('No data received from dashboard stats API');
    }

    return response.data.data.dashboardStats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
};

export const getRecentTasks = async (): Promise<RecentTasksResponse> => {
  try {
    console.log('Fetching recent tasks...');
    const response = await api.get<RecentTasksResponse>('/dashboard/recent-tasks');
    console.log('Recent tasks response:', response.data);
    
    if (!response.data) {
      throw new Error('No data received from recent tasks API');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching recent tasks:', error);
    throw new Error('Failed to fetch recent tasks');
  }
}; 