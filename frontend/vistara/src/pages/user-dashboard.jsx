import Navbar from '../components/navbar';
import React from 'react';
import '../styles/dashboard.css';
import UserDashboardhome from '../components/userDashboardhome';
import SidebarUser from '../components/sidebar-user';

const Dashboard = () => {
    return (
        <>
            <div className='grid-container'>
              <Navbar />
              <SidebarUser />
              <UserDashboardhome/>
            </div>
        </>
    );
};

export default Dashboard;