import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';  // Explicitly import autoTable
import '../styles/dashboard.css';

const Table = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/auth/users');
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const exportToPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('User Report', 14, 22);

        const tableColumn = ['Name', 'Email', 'Phone', 'Role'];
        const tableRows = data.map(user => [
            user.displayUsername,
            user.email,
            '0' + user.phone,
            user.role,
        ]);

        // Explicitly use autoTable from jspdf-autotable
        autoTable(doc, {
            startY: 30,
            head: [tableColumn],
            body: tableRows,
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [4, 170, 109],
            },
        });

        doc.save('user-report.pdf');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <main className='main-container'>
            <button onClick={exportToPDF} 
             style={{
                marginBottom: '16px', 
                padding: '10px 20px', 
                backgroundColor: '#0d6efd', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '5px', 
                fontSize: '16px', 
                fontWeight: '500', 
                cursor: 'pointer', 
                transition: 'background-color 0.3s, transform 0.2s ease-in-out'
              }}
            
            >
                Download Report (PDF)
            </button>

            <table style={{
                fontFamily: 'Montserrat, sans-serif',
                borderCollapse: 'collapse',
                width: '100%',
            }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#0d6efd', color: 'white' }}>Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#0d6efd', color: 'white' }}>Email</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#0d6efd', color: 'white' }}>Phone</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#0d6efd', color: 'white' }}>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr key={user.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px', color: 'gray' }}>{user.displayUsername}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', color: 'gray' }}>{user.email}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', color: 'gray' }}>0{user.phone}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', color: 'gray' }}>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default Table;
