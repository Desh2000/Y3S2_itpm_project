import React from 'react'
import SidebarUser from '../components/sidebar-user';
import UserDashboardhome from '../components/userDashboardhome';
import Navbar from '../components/navbar';
import Profileview from '../components/profile-view';


function Profile() {
    return (
        <>
            <div className='grid-container'>
              <Navbar />
              <SidebarUser />
              <Profileview/>
            </div>
            
        </>
    );
}

export default Profile