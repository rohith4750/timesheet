export const apiUrl = {
    GET_getAllUsers: `list/users`, // users
  GET_getUserByID: (id: any) => `list/user/${id}`, // users
  POST_createUser: `create/user`, // users
  POST_createSuperAdmin: `create/super-admin`, // users
  PUT_updateUser: (id: any) => `modify/user/${id}`, //users
  DEL_deleteUser: (id: any) => `delete/user/${id}`, // users
  GET_loggedInUserSno : `list/logged-in-user_sno/`,
  GET_checkIsSuperAdmin: `check/is_super_admin/`,
}