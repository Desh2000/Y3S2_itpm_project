import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/dashboard.css'; // Import dashboard.css - Ensure this path is correct

const Table = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/users');
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Inline styles for the table - using variables for better organization
    const tableStyles = {
        fontFamily: 'Montserrat, sans-serif',
        borderCollapse: 'collapse',
        width: '100%',
    };

    const thStyles = {
        border: '1px solid #ddd',
        padding: '12px',
        textAlign: 'left',
        backgroundColor: '#04AA6D',
        color: 'white',
    };

    const tdStyles = {
        border: '1px solid #ddd',
        padding: '8px',
        color: 'gray'
    };

    

    return (
        <main className='main-container'>
            <table style={tableStyles}>
                <thead>
                    <tr>
                        <th style={thStyles}>Name</th>
                        <th style={thStyles}>Email</th>
                        <th style={thStyles}>Phone</th>
                        <th style={thStyles}>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr key={user.id} >
                            <td style={tdStyles}>{user.displayUsername}</td>
                            <td style={tdStyles}>{user.email}</td>
                            <td style={tdStyles}>0{user.phone}</td>
                            <td style={tdStyles}>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default Table;
