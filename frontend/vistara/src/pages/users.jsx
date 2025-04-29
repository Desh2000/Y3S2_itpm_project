import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import React from 'react';
import '../styles/dashboard.css';
import Table from '../components/table';


const Users = () => {
    return (
        <>
           <div className='grid-container'>
              <Navbar />
              <Sidebar />
              <Table/>
            </div>
        </>
    );
};

export default Users;