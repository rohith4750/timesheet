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
import "./userlist.scss";
import { PERMISSIONS } from "../../constants/permissions";
import { userTableColumns } from "./user-config";

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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const verifyPermission = async () => {
      try {
        const isAdmin = await checkSuperAdmin();
        localStorage.setItem("isSuperAdmin", String(isAdmin));
        const canView = permissionAccess(PERMISSIONS.VIEW_USER);
        setHasPermission(canView);
      } catch (error) {
        console.error("Error checking admin status:", error);
        localStorage.setItem("isSuperAdmin", "false");
        setHasPermission(permissionAccess(PERMISSIONS.VIEW_USER));
      }
    };
    verifyPermission();
  }, [navigate]);

  useEffect(() => {
    if (hasPermission === false) {
      showToast({
        type: "error",
        message: "You don't have permission to view this page.",
        duration: 3000,
      });
      navigate("/home-page");
    }
  }, [hasPermission, navigate, showToast]);

  const fetchData = useCallback(
    async (params: FilterParams) => {
      try {
        const response = await getUsers(params.page || 1, params.limit || 10);
        if (!response || !response.users) {
          return { data: [], total: 0 };
        }
        const formattedData = response.users.map((user: UserData) => ({
          ...user,
          id: user.user_sno,
          actions: true,
        }));
        return {
          data: formattedData,
          total: response.total,
          users: formattedData,
        };
      } catch (error) {
        if ((error as AxiosError)?.response?.status !== 403) {
          showToast({
            type: "error",
            message: "Failed to fetch users.",
            duration: 3000,
          });
        }
        return { data: [], total: 0 };
      }
    },
    [showToast]
  );

  const handleEdit = (item: UserData) => {
    navigate(`/user/edit/${item.user_sno}`);
  };

  const handleDelete = async (item: UserData) => {
    try {
      await deleteUser(item.user_sno as number);
      showToast({ type: "success", message: "User deleted." });
      setRefreshTrigger((prev) => prev + 1);
      return { message: "User deleted successfully" };
    } catch (error) {
      showToast({ type: "error", message: "Failed to delete user." });
      throw new Error("Failed to delete user");
    }
  };

  if (hasPermission === null) {
    return <div>Verifying permissions...</div>;
  }

  if (hasPermission === false) {
    return null;
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1>User Management</h1>
        {permissionAccess(PERMISSIONS.CREATE_USER) && (
          <Button
            onClick={() => navigate("/user/add")}
            showPlusIcon
            variant="primary"
          >
            Add New User
          </Button>
        )}
      </div>

      <TableComponent
        key={refreshTrigger}
        columns={userTableColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        fetchData={fetchData}
        dataKey="users"
        textkey="user_fullname"
        heading="User"
        createPermission={PERMISSIONS.CREATE_USER}
        deletePermission={PERMISSIONS.DELETE_USER}
        updatePermission={PERMISSIONS.EDIT_USER}
      />
    </div>
  );
};

export default UserList;
