import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { fetchUser } = UserData();

  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, []);

  const handleGetStarted = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${server}/api/course/subscribe/${course._id}`,
        {},
        {
          headers: {
            token,
          },
        }
      );
      toast.success(data.message);
      setLoading(false);
      fetchUser();
      fetchMyCourse();
      navigate(`/lectures/${course._id}`);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {course && (
            <div className="course-description">
              <div className="course-header">
                <img
                  src={`${server}/${course.image}`}
                  alt=""
                  className="course-image"
                />
                <div className="course-info">
                  <h2>{course.title}</h2>
                  <p>Instructor: {course.createdBy}</p>
                  <p>Duration: {course.duration} weeks</p>
                </div>
              </div>

              <p>{course.description}</p>

              {user && user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button
                  onClick={handleGetStarted}
                  className="common-btn"
                >
                  Get Started
                </button>
              )}

              {user && user.subscription.includes(course._id) && (
                <button
                  onClick={() => navigate(`/quiz/${course.quizId}`)}
                  className="common-btn"
                >
                  Take Quiz
                </button>
              )}

              {user && user.role === "admin" && (
                <button
                  onClick={() => navigate(`/admin/create-quiz/${course._id}`)}
                  className="common-btn"
                  style={{ background: "blue" }}
                >
                  Create Quiz
                </button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseDescription;