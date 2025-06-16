import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/table/table";
import { permissionAccess } from "../../hooks/permissionAccess";
import Button from "../../components/button/button";
import { useToast } from "../../components/toast/ToastContext";
import {
  getUsers,
  deleteUser,
  UserData,
  checkSuperAdmin,
} from "../../api/userApi";
import axios from "axios";
import "./userlist.scss";
import { PERMISSIONS } from "../../constants/permissions";

interface UserListApiResponse {
  data: UserData[];
  total: number;
  message: string;
}

interface FilterParams {
  filters?: Record<keyof UserData, string>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sort_order?: string;
}

type AxiosError = {
  response?: {
    status: number;
  };
};

const UserList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);

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
      label: "S.No",
      field: "user_sno",
    },
    {
      sortable: true,
      key: "user_id",
      label: "User ID",
      field: "user_id",
    },
    {
      sortable: true,
      key: "user_name",
      label: "User Name",
      field: "user_name",
    },
    {
      sortable: true,
      key: "user_phone",
      label: "Phone",
      field: "user_phone",
    },
    {
      sortable: true,
      key: "user_email",
      label: "Email",
      field: "user_email",
    },
    {
      sortable: false,
      key: "action",
      label: "Actions",
      field: "action",
      type: "action",
      list: [
        {
          label: "edit",
          btnType: "icon",
        },
        {
          label: "delete",
          btnType: "icon",
        },
      ],
    },
  ];

  const fetchData = useCallback(
    async (params: FilterParams) => {
      try {
        const response = await getUsers(params.page || 1, params.limit || 10);
        console.log("API Response:", response); // Debug

        if (!response || !response.users) {
          console.error("Invalid response format:", response);
          return { data: [], total: 0, users: [] };
        }

        // Ensure data is properly formatted for the table
        const formattedData = response.users.map((user: UserData) => ({
          ...user,
          id: user.user_sno, // Ensure ID field is present
          actions: true, // Enable row actions
        }));

        return {
          data: formattedData,
          total: formattedData.length,
          users: formattedData,
        };
      } catch (error) {
        console.error("Error fetching users:", error);
        if ((error as AxiosError)?.response?.status === 401) {
          navigate("/login");
        }
        return { data: [], total: 0, users: [] }; // Return empty data on error
      } finally {
        setLoading(false);
      }
    },
    [navigate, refreshTrigger]
  );

  const handleEdit = (item: UserData) => {
    navigate(`/user/edit/${item.user_sno}`);
  };

  const handleDelete = async (item: UserData): Promise<{ message: string }> => {
    try {
      if (!item.user_sno) throw new Error("User SNO is required");
      const response = await deleteUser(item.user_sno);
      setRefreshTrigger((prev) => prev + 1);
      showToast({
        type: "success",
        message: "User deleted successfully",
        duration: 2000,
      });
      return { message: "User deleted successfully" };
    } catch (error) {
      console.error("Error deleting user:", error);
      if ((error as AxiosError)?.response?.status === 401) {
        navigate("/login");
      }
      showToast({
        type: "error",
        message: "Failed to delete user. Please try again.",
        duration: 5000,
      });
      throw new Error("Failed to delete user");
    }
  };

  useEffect(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        {permissionAccess(PERMISSIONS.CREATE_USER) && (
          <Button variant="primary" onClick={() => navigate("/user/add")}>
            Add User
          </Button>
        )}
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
        actions={true}
      />
    </div>
  );
};

export default UserList;
