import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Form } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/auth/users');
      setUsers(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/auth/user/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdate = async (user) => {
    try {
      const updated = {
        ...users,
      };
      const response = await axios.patch(`http://localhost:8081/api/auth/update/${user.id}`, updated);
      if (response.status === 200) {
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingUser({
      ...users,
    });
  };
  const handleChange = (e) => {
    setEditingUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('User Report', 14, 15);
    const tableColumn = ["Name", "Category", "Location", "Start", "End", "Description", "Contact", "Email", "Status"];
    const tableRows = [];

    filteredUsers.forEach(user => {
      const userData = [
        user.displayUsername,
        user.Email,
        user.phone,
        user.role,
      ];
      tableRows.push(userData);
    });

    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 }
    });

    doc.save("user-report.pdf");
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Admin Panel</h2>
      <Form.Control
        className="mb-3 w-50 mx-auto"
        placeholder="Search by user name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="text-center mb-3">
        <Button variant="dark" onClick={exportToPDF}>Export as PDF</Button>
      </div>

      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th >Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            editingUser?.id === user.id ? (
              <tr key={user.id}>
                <td><Form.Control name="displayUsername" value={editingUser.displayUsername} onChange={handleChange} /></td>
                <td><Form.Control name="email" value={editingUser.email} onChange={handleChange} /></td>
                <td><Form.Control name="phone" value={editingUser.phone} onChange={handleChange} /></td>
                <td><Form.Control name="role" value={editingUser.role} onChange={handleChange} /></td>
                <td>
                  <Button variant="success" size="sm" onClick={() => handleUpdate(editingUser)}>Save</Button>{' '}
                  <Button variant="secondary" size="sm" onClick={() => setEditingUser(null)}>Cancel</Button>
                </td>
              </tr>
            ) : (
              <tr key={user.id}>
                <td>{user.displayUsername}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleEdit(user)}>Edit</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default UserAdmin;
