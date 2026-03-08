import { Link } from "react-router";

export const meta = () => [
  { title: "Privacy — ProfitPilot Ads" },
  {
    name: "description",
    content: "Privacy policy for ProfitPilot Ads.",
  },
];

const containerStyle = {
  maxWidth: "48rem",
  margin: "0 auto",
  padding: "2rem 1rem",
};

const titleStyle = {
  fontSize: "1.875rem",
  fontWeight: 700,
  margin: "0 0 1rem 0",
};

const pStyle = {
  lineHeight: 1.6,
  color: "#374151",
  margin: "0 0 1rem 0",
};

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

export default function PrivacyPage() {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Privacy</h1>
      <p style={pStyle}>
        ProfitPilot Ads processes data necessary to connect your Shopify store with
        Meta, Google, and TikTok advertising platforms: store identifiers, ad account
        IDs, aggregated metrics, and encrypted OAuth tokens. We do not sell your data.
      </p>
      <p style={pStyle}>
        For full details on what we collect and how we use it, please contact us at{" "}
        <a href="mailto:support@profitpilotads.com" style={linkStyle}>
          support@profitpilotads.com
        </a>
        .
      </p>
      <p style={pStyle}>
        <strong>Data deletion.</strong> To request deletion of your data, visit:{" "}
        <Link to="/data-deletion" style={linkStyle}>
          /data-deletion
        </Link>
        . We will process your request in line with our data deletion policy (TikTok,
        Meta, and Google compliance).
      </p>
      <footer style={footerStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        {" · "}
        <Link to="/data-deletion" style={linkStyle}>Data Deletion</Link>
      </footer>
    </div>
  );
}
