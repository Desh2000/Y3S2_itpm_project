import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import React from 'react';
import Dashboardhome from '../components/dashboardhome';
import '../styles/dashboard.css';

const Dashboard = () => {
    return (
        <>
            <div className='grid-container'>
              <Navbar />
              <Sidebar />
              <Dashboardhome/>
            </div>
            
        </>
    );
};

export default Dashboard;