import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer py-4 mt-auto border-top">
      <Container fluid="lg">
        <Row className="align-items-center justify-content-center">
          <Col xs={12} sm={6} md={4} className="text-center text-sm-start mb-3 mb-sm-3 mb-md-0">
            <h5 className="mb-0 footer-title">Vistara</h5>
            <p className="text-muted small mb-0">Connect. Share. Engage.</p>
          </Col>
          
          <Col xs={12} sm={6} md={4} className="text-center mb-3 mb-md-0">
            <div className="social-icons d-flex justify-content-center">
              <a href="#" className="social-icon text-secondary mx-2" title="Facebook">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="social-icon text-secondary mx-2" title="Twitter">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="social-icon text-secondary mx-2" title="Instagram">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="social-icon text-secondary mx-2" title="LinkedIn">
                <FaLinkedin size={18} />
              </a>
              <a href="#" className="social-icon text-secondary mx-2" title="GitHub">
                <FaGithub size={18} />
              </a>
            </div>
          </Col>
          
          <Col xs={12} md={4} className="text-center text-md-end mt-3 mt-md-0">
            <p className="text-muted small mb-1">
              &copy; {currentYear} Wisthara. All rights reserved.
            </p>
            <p className="text-muted small mb-0">
              <a href="#" className="text-decoration-none text-secondary me-2">Privacy Policy</a>
              <span className="d-none d-sm-inline">|</span>
              <a href="#" className="text-decoration-none text-secondary ms-2">Terms of Service</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 