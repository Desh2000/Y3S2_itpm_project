import React, { useState } from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBell, FaEnvelope, FaPlus, FaSearch, FaUserCircle, FaCog, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import { useChatbot } from '../contexts/ChatbotContext';

const Header = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const { getHelp } = useChatbot();

  const toggleNavbar = () => setExpanded(!expanded);
  const closeNavbar = () => setExpanded(false);

  const handleHelpClick = (e) => {
    e.preventDefault();
    getHelp();
    closeNavbar();
  };

  return (
    <header className="header">
      <Navbar expand="lg" expanded={expanded} onToggle={toggleNavbar} bg="primary" variant="dark" className="py-2">
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={closeNavbar} className="fw-bold">
          Vistara
          </Navbar.Brand>
          
          <div className="d-flex d-lg-none ms-auto me-2 gap-2">
            <Link to="/create-announcement" className="btn btn-light btn-sm d-flex align-items-center justify-content-center">
              <FaPlus />
            </Link>
          </div>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                as={Link} 
                to="/" 
                className={location.pathname === '/' ? 'active' : ''} 
                onClick={closeNavbar}
              >
                <span className="d-inline">Home</span>
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/view-event" 
                className={location.pathname === '/' ? 'active' : ''} 
                onClick={closeNavbar}
              >
                <span className="d-inline">Event</span>
              </Nav.Link>
            </Nav>
            
            <div className="search-container my-2 my-lg-0 mx-lg-2 w-100" style={{ maxWidth: '300px' }}>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search announcements..."
                  style={{ 
                    borderRadius: '20px',
                    paddingLeft: '35px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: 'white'
                  }}
                />
                <FaSearch 
                  style={{ 
                    position: 'absolute',
                    top: '10px',
                    left: '12px',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}
                />
              </div>
            </div>
            
            <Nav className="ms-auto d-flex flex-row align-items-center">
              <div className="d-none d-lg-block me-2">
                <Button
                  as={Link}
                  to="/create-announcement"
                  variant="light"
                  size="sm"
                  className="px-3"
                  style={{ borderRadius: '20px' }}
                  onClick={closeNavbar}
                >
                  <FaPlus className="me-1" /> New Announcement
                </Button>
              </div>
              
              <Nav.Link href="#" className="position-relative icon-link mx-1 p-2" title="Help" onClick={handleHelpClick}>
                <FaQuestionCircle />
              </Nav.Link>
              
              <Nav.Link href="#" className="position-relative icon-link mx-1 p-2" onClick={closeNavbar}>
                <FaBell />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.5rem' }}>
                  3
                </span>
              </Nav.Link>
              
              <Nav.Link href="#" className="position-relative icon-link mx-1 p-2" onClick={closeNavbar}>
                <FaEnvelope />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.5rem' }}>
                  2
                </span>
              </Nav.Link>
              
              <Dropdown align="end">
                <Dropdown.Toggle 
                  as="a" 
                  className="nav-link dropdown-toggle p-1 ms-2" 
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                    alt="Profile"
                    className="nav-profile-pic"
                  />
                </Dropdown.Toggle>
                
                <Dropdown.Menu>
                  <Dropdown.Item href="http://localhost:5173/profile" onClick={closeNavbar}>
                    <FaUserCircle className="me-2" /> Profile
                  </Dropdown.Item>
                  <Dropdown.Item href="#" onClick={closeNavbar}>
                    <FaCog className="me-2" /> Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#" onClick={closeNavbar}>
                    <FaSignOutAlt className="me-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header; 