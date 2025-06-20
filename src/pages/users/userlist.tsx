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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
        fetchData={getUsers}
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
