import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../services/API";
import { getCurrentUser } from "../../redux/features/auth/authActions";
import { Navigate } from "react-router-dom";
import Spinner from "../shared/Spinner";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const { data } = await API.get("/auth/current-user");
        if (data?.success) {
          dispatch(getCurrentUser(data));
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [dispatch]);

  // Show loading spinner until API response is received
  if (loading) {
    return <Spinner />;
  }

  // Redirect if user is not authenticated
  if (!localStorage.getItem("token") || !user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
