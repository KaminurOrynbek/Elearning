import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import "./AdminDashboard.css";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);

  // Redirect if user is not admin
  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  // Access restriction for superadmins only
  if (user.mainrole !== "superadmin") {
    return <div>Access Denied. Only superadmins can access this page.</div>;
  }

  // Fetch statistics for the dashboard
  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>

        {/* Navigation Links */}
        <ul>
          <li>
            <Link to="/admin/course">Manage Courses</Link>
          </li>
          <li>
            <Link to="/admin/users">Manage Users</Link>
          </li>
          <li>
            <Link to="/admin/update-role">Update User Roles</Link>
          </li>
          <li>
            <Link to="/admin/create-quiz">Create Quiz</Link>
          </li>
        </ul>

        {/* Statistics Section */}
        <div className="main-content">
          <div className="box">
            <p>Total Courses</p>
            <p>{stats.totalCourses || 0}</p>
          </div>
          <div className="box">
            <p>Total Lectures</p>
            <p>{stats.totalLectures || 0}</p>
          </div>
          <div className="box">
            <p>Total Users</p>
            <p>{stats.totalUsers || 0}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;