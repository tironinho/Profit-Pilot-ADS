import { Link } from "react-router";

const footerStyle = {
  marginTop: "3rem",
  paddingTop: "1.5rem",
  borderTop: "1px solid #e5e7eb",
  fontSize: "0.875rem",
  color: "#6b7280",
};

const linkStyle = {
  color: "#2563eb",
  textDecoration: "none",
};

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <Link to="/" style={linkStyle}>Home</Link>
      {" · "}
      <Link to="/privacy" style={linkStyle}>Privacy</Link>
      {" · "}
      <Link to="/data-deletion" style={linkStyle}>Data Deletion</Link>
    </footer>
  );
}
