import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Button, Form, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const API_ENDPOINT =
  "https://crudcrud.com/api/f633303d478340f78e3f69830e64dd47/members";
// const API_ENDPOINT =
//   "https://cors-anywhere.herokuapp.com/https://crudcrud.com/api/f633303d478340f78e3f69830e64dd47/members";

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMember, setCurrentMember] = useState({
    name: "",
    Email: "",
    age: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(API_ENDPOINT);
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
      Swal.fire("Error", "Failed to fetch members", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMember({
      ...currentMember,
      [name]: name === "age" ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        if (!currentMember._id) {
          console.log("miss id");
        }
        await fetch(`${API_ENDPOINT}/${currentMember._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentMember),
          //   mode: "no-cors",
        });
        Swal.fire("Success", "Member updated successfully", "success");
      } else {
        await fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentMember),
        });
        Swal.fire("Success", "Member added successfully", "success");
      }
      fetchMembers();
      setShowModal(false);
      setCurrentMember({ name: "", Email: "", age: 0 });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message || "Failed to save member", "error");
    }
  };

  const handleEdit = (member) => {
    setCurrentMember(member);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_ENDPOINT}/${id}`, { method: "DELETE" });
      Swal.fire("Success", " deleted successfully", "success");
      fetchMembers();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete member", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4   text-center text-primary text-uppercase">
        Member List
      </h1>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-3 "
      >
        <FaUserPlus /> Add Member
      </Button>
      <Table
        striped
        bordered
        hover
        className="table table-dark text-center w-100"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.Email}</td>
              <td>{member.age}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleEdit(member)}
                  className="me-2"
                >
                  <FaEdit /> Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(member._id)}
                >
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Member" : "Add Member"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentMember.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="Email"
                value={currentMember.Email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={currentMember.age}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {isEditing ? "Update" : "Add"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MemberManagement;
