import React, { useEffect, useState } from "react";
import Layout from "./../../components/shared/Layout/Layout";
import moment from "moment";
import { useSelector } from "react-redux";
import API from "../../services/API";

const OrganisationPage = () => {
  // Get current user
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  // Fetch organization records based on user role
  const getOrg = async () => {
    try {
      let response;

      if (user?.role === "donor") {
        response = await API.get("/inventory/get-organisation");
      } else if (user?.role === "hospital") {
        response = await API.get("/inventory/get-organisation-for-hospital");
      } else {
        response = await API.get("/inventory/get-organisation");
      }

      if (response?.data?.success) {
        setData(response?.data?.organisations);
      }
    } catch (error) {
      console.error("Error fetching organisation data:", error);
    }
  };

  useEffect(() => {
    getOrg();
  }, [user]); // Ensures data refetch when user role changes

  return (
    <Layout>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Address</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((record) => (
            <tr key={record._id}>
              <td>{record.organisationName}</td>
              <td>{record.email}</td>
              <td>{record.phone}</td>
              <td>{record.address}</td>
              <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default OrganisationPage;
