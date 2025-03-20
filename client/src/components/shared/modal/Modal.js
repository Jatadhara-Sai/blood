import React, { useState } from "react";
import { useSelector } from "react-redux";
import InputType from "./../Form/InputType";
import API from "./../../../services/API";  // ✅ Ensure API is imported

const Modal = () => {
  // ✅ Ensure all state variables exist
  const [inventoryType, setInventoryType] = useState("in");
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [donarEmail, setDonarEmail] = useState("");
  const { user } = useSelector((state) => state.auth);  // ✅ Ensure user exists

  // Handle form submission
  const handleModalSubmit = async () => {
    try {
      if (!bloodGroup || !quantity) {
        return alert("Please provide all fields.");
      }

      const token = localStorage.getItem("token"); // ✅ Retrieve token

      if (!token) {
        alert("Unauthorized! Please log in again.");
        window.location.href = "/login";
        return;
      }

      if (!user || !user.email) {
        alert("User not found! Please log in again.");
        window.location.href = "/login";
        return;
      }

      const { data } = await API.post(
        "/inventory/create-inventory",
        {
          donarEmail,
          email: user.email, // ✅ Ensure user email exists
          organisation: user._id,
          inventoryType,
          bloodGroup,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token in headers
          },
        }
      );

      if (data?.success) {
        alert("New Record Created");
        window.location.reload();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
      console.log(error);
      window.location.reload();
    }
  };

  return (
    <>
      {/* Modal */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Manage Blood Record
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              {/* Radio Buttons */}
              <div className="d-flex mb-3">
                Blood Type: &nbsp;
                <div className="form-check ms-3">
                  <input
                    type="radio"
                    name="inventoryType"
                    checked={inventoryType === "in"}
                    value="in"
                    onChange={(e) => setInventoryType(e.target.value)}
                    className="form-check-input"
                  />
                  <label htmlFor="in" className="form-check-label">IN</label>
                </div>
                <div className="form-check ms-3">
                  <input
                    type="radio"
                    name="inventoryType"
                    checked={inventoryType === "out"}
                    value="out"
                    onChange={(e) => setInventoryType(e.target.value)}
                    className="form-check-input"
                  />
                  <label htmlFor="out" className="form-check-label">OUT</label>
                </div>
              </div>

              {/* Blood Group Select Dropdown */}
              <select
                className="form-select"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="" disabled>Select Blood Group</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
              </select>

              {/* Donor Email Input */}
              <InputType
                labelText="Donor Email"
                labelFor="donarEmail"
                inputType="email"
                value={donarEmail}
                onChange={(e) => setDonarEmail(e.target.value)}
              />

              {/* Quantity Input */}
              <InputType
                labelText="Quantity (ML)"
                labelFor="quantity"
                inputType="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleModalSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
