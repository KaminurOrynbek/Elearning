import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { server } from "../../main";
import toast from "react-hot-toast";

const UpdateRole = ({ user }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${server}/api/users`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        setUsers(data.users);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateRole = async (id) => {
    if (confirm("Are you sure you want to update this user's role?")) {
      try {
        const { data } = await axios.put(
          `${server}/api/user/${id}`,
          {},
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        toast.success(data.message);
        setUsers(users.map(user => user._id === id ? { ...user, role: user.role === "admin" ? "user" : "admin" } : user));
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  if (user.mainrole !== "superadmin") {
    return <div>Access Denied. Only superadmins can update roles.</div>;
  }

  return (
    <div className="update-role-container">
      <h2>Update User Roles</h2>
      <table border="1">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Update Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleUpdateRole(user._id)}>
                  {user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateRole;