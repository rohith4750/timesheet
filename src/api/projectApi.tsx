import axios from "axios";
import { getAuthHeader } from './authUtils';

const BASE_URL = "http://localhost:3001/api";

export const createProject = async (projectData: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/create/project`,
      projectData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProjectDetails = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/list/projectdetails`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};
