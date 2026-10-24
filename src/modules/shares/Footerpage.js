import { Link } from "react-router-dom";
import {
  FaBolt,
  FaTools,
  FaPlug,
  FaPaintRoller,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaInstagram,
  FaLinkedinIn,
  FaArrowRight,
} from "react-icons/fa";

function Footerpage() {
  return (
    <footer className="text-white" style={{ backgroundColor: "#102D4F" }}>
      <div className="container py-5">
        <div className="row g-4">
          {/* Company Details */}
          <div className="col-lg-4 col-md-6">
            <h4 className="fw-bold mb-3">
              CONVERLINK <span style={{ color: "#38C8F5" }}>ENGINEERING</span>
            </h4>

            <p className="text-white-50">
              Your trusted partner for electrical work, maintenance,
              installation and interior designing solutions.
            </p>

            <div className="d-flex gap-3 mt-4">
              <Link
                to ="https://wa.me/9015189096"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                <FaWhatsapp /> 
              </Link>
              <Link
                to="https://www.instagram.com/thakur_prashant_chauhan_01/"
                className="footer-social"
                aria-label="Instagram"
              >
                <FaInstagram />
              </Link>
              <Link
                to="https://www.linkedin.com/in/prashant-kumar-9a3984320"
                className="footer-social"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3">Quick Links</h5>

            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="home" className="footer-link">
                  <FaArrowRight className="me-2" /> Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="services" className="footer-link">
                  <FaArrowRight className="me-2" /> Services
                </Link>
              </li>
              <li className="mb-2">
                <Link to="project" className="footer-link">
                  <FaArrowRight className="me-2" /> Projects
                </Link>
              </li>
              <li className="mb-2">
                <Link to="contact" className="footer-link">
                  <FaArrowRight className="me-2" /> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Our Services</h5>

            <p className="footer-service">
              <FaBolt /> Electrical Work
            </p>
            <p className="footer-service">
              <FaTools /> Maintenance
            </p>
            <p className="footer-service">
              <FaPlug /> Installation
            </p>
            <p className="footer-service">
              <FaPaintRoller /> Interior Designing
            </p>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Contact Us</h5>

            <p className="footer-contact">
              <FaPhoneAlt className="footer-icon" />
              <span>9015189096</span>
            </p>

            <p className="footer-contact">
              <FaEnvelope className="footer-icon" />
              <span>Converlink@gmail.com</span>
            </p>

            <p className="footer-contact">
              <FaMapMarkerAlt className="footer-icon" />
              <span>Aakash Nagar Ghaziabad 201013.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div
        className="py-3"
        style={{
          backgroundColor: "#0A2038",
          borderTop: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="mb-0 small text-white-50">
            © {new Date().getFullYear()} Converlink Engineering Pvt. Ltd. All
            rights reserved.
          </p>

          <p className="mb-0 small text-white-50">
            Quality Work. Trusted Solutions.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footerpage;
