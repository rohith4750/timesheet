import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/table/table";
import { permissionAccess } from "../../hooks/permissionAccess";
import Button from "../../components/button/button";
import {
  getUsers,
  deleteUser,
  UserData,
  checkSuperAdmin,
} from "../../api/userapi";
import axios from "axios";
import "./userlist.scss";

interface FilterParams {
  filters?: Record<keyof UserData, string>;
}

type AxiosError = {
  response?: {
    status: number;
  };
};

const UserList = () => {
  const navigate = useNavigate();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const isAdmin = await checkSuperAdmin();
        setIsSuperAdmin(isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        if ((error as AxiosError)?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    checkAdminStatus();
  }, [navigate]);

  const columns = [
    {
      sortable: true,
      key: "user_sno",
      label: "User SNO",
      field: "user_sno",
      filterType: "text",
    },
    {
      sortable: true,
      key: "user_id",
      label: "User ID",
      field: "user_id",
      filterType: "text",
    },
    {
      sortable: true,
      key: "user_name",
      label: "Name",
      field: "user_name",
      filterType: "text",
    },
    {
      sortable: true,
      key: "user_phone",
      label: "Phone",
      field: "user_phone",
      filterType: "text",
    },
    {
      sortable: true,
      key: "user_email",
      label: "Email",
      field: "user_email",
      filterType: "text",
    },
  ];

  const fetchData = useCallback(
    async (params: FilterParams) => {
      try {
        const page = 1; // TODO: Implement pagination
        const limit = 10;
        const response = await getUsers(page, limit);
        return {
          data: response.data,
          total: response.total,
        };
      } catch (error) {
        console.error("Error fetching users:", error);
        if ((error as AxiosError)?.response?.status === 401) {
          navigate("/login");
        }
        throw error;
      }
    },
    [navigate, refreshTrigger]
  ); // Add refreshTrigger to dependencies

  const handleEdit = (item: UserData) => {
    navigate(`/user/edit/${item.id}`);
  };

  const handleDelete = async (item: UserData): Promise<{ message: string }> => {
    try {
      if (!item.user_sno) throw new Error("User SNO is required");
      const response = await deleteUser(item.user_sno);
      setRefreshTrigger((prev) => prev + 1); // Trigger refresh after deletion
      return { message: response.message };
    } catch (error) {
      console.error("Error deleting user:", error);
      if ((error as AxiosError)?.response?.status === 401) {
        navigate("/login");
      }
      throw new Error("Failed to delete user");
    }
  };

  useEffect(() => {
    // Refresh data when component mounts or when returning from add/edit page
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <Button variant="primary" onClick={() => navigate("/user/add")}>
          Add User
        </Button>
      </div>
      <TableComponent
        columns={columns}
        fetchData={fetchData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        heading="Users"
        deletePermission="DELETE_USER"
        updatePermission="UPDATE_USER"
        createPermission="CREATE_USER"
        dataKey="users"
        textkey="user"
      />
    </div>
  );
};

export default UserList;
