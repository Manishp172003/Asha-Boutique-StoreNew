import { useState } from 'react';
import { HelpCircle, ChevronDown, Mail, Phone, ExternalLink, Settings, ShieldAlert, Award, FileText } from 'lucide-react';
import './Help.css';
import AdminSidebar from '../../../components/admin/Sidebar/AdminSidebar';
import AdminTopNav from '../../../components/admin/TopNav/AdminTopNav';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'faq-item--active' : ''}`}>
      <button className="faq-item__trigger" onClick={() => setIsOpen(!isOpen)}>
        <h4 className="faq-item__question">{question}</h4>
        <ChevronDown className="faq-item__icon" size={18} />
      </button>
      {isOpen && (
        <div className="faq-item__content">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const Help = () => {
  const faqs = [
    {
      question: "How do I create and manage products?",
      answer: "Click the 'New Product' button in the sidebar footer or the 'Add Product' button in the top-right of the Products view. Fill in the details, choose one of the predefined boutique categories (Dresses, Tops, Tailoring, Accessories, Sale), and choose up to 5 images. The first image uploaded behaves as the main thumbnail, with other files serving as detailed view options."
    },
    {
      question: "How do I advance shipment and payment statuses?",
      answer: "Navigate to the Orders list and click the details (eye) button on any purchase row. Use the drop-down selectors to advance the shipment timeline (PENDING -> PROCESSING -> SHIPPED -> DELIVERED) or toggle payment status (PENDING, PAID, FAILED, REFUNDED). Updating order status updates the client profiles instantly."
    },
    {
      question: "How do I accept or reschedule salon bookings?",
      answer: "In the Appointments panel, look at the bookings list. Click 'Confirm' to approve the appointment reservation slot or 'Cancel' to drop it. Status changes reflect instantly on the client dashboard."
    },
    {
      question: "How do I block or delete database users?",
      answer: "Open the Customer Directory. In the actions column, select 'Block' (to revoke login privileges and lock the account) or 'Delete' (to wipe the client registry reference). For security, admins cannot delete or block themselves."
    },
    {
      question: "How do I export inventory, orders, and customer lists?",
      answer: "Use the 'Export' buttons located in the headers of the Products, Orders, and Customers grids. The dashboard automatically packages your current search results and filters into a downloadable CSV spreadsheet format."
    }
  ];

  const guideSteps = [
    {
      title: "Product Catalog Curating",
      desc: "Curate your digital store with artisan pieces. Multi-image uploads are stored on the Spring Boot server configuration, serving paths instantly."
    },
    {
      title: "Invoice & Shipments Operations",
      desc: "Client checkouts trigger active invoice orders, placing items in the admin ledger. Track deliveries and payments securely."
    },
    {
      title: "Salon Bookings Control",
      desc: "Approve scheduling reservations and stylist buffer times dynamically through the settings panel to balance boutique capacity."
    }
  ];

  return (
    <div className="admin-page">
      <AdminSidebar />
      <AdminTopNav />
      
      <main className="admin-main">
        {/* Header */}
        <div className="admin-page-header" style={{ marginBottom: "24px" }}>
          <div className="admin-page-header__content">
            <nav className="admin-breadcrumb">
              <span>Dashboard</span>
              <span>/</span>
              <span className="admin-breadcrumb__active">Help Center</span>
            </nav>
            <h2 className="admin-page-header__title">Help & Documentation Center</h2>
            <p className="admin-page-header__description">
              Find answers to frequently asked questions, learn how to navigate workflows, or contact system support.
            </p>
          </div>
        </div>

        <div className="help-grid">
          {/* FAQ Accordion Column */}
          <div className="help-main-content">
            <div className="help-card">
              <h3 className="help-card__title">Frequently Asked Questions</h3>
              <p className="help-card__subtitle">Browse guidelines for products, sales, customers, and bookings management.</p>
              
              <div className="faq-list">
                {faqs.map((faq, idx) => (
                  <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>

            <div className="help-card">
              <h3 className="help-card__title">Boutique Suite Architecture</h3>
              <p className="help-card__subtitle">A quick walkthrough of how user purchases, inventory updates, and salon bookings interact.</p>
              
              <div className="guide-timeline">
                {guideSteps.map((step, idx) => (
                  <div key={idx} className="guide-step">
                    <div className="guide-step__bullet"></div>
                    <h4 className="guide-step__title">{step.title}</h4>
                    <p className="guide-step__desc">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Support Sidebar */}
          <div className="help-sidebar">
            <div className="help-card">
              <h3 className="help-card__title" style={{ fontSize: "1.5rem" }}>System Support</h3>
              <p className="help-card__subtitle" style={{ marginBottom: "1.5rem" }}>Reach out directly to technical support or read documentation references.</p>
              
              <div className="support-item">
                <div className="support-item__icon">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="support-item__title">Email Support</h4>
                  <p className="support-item__desc">
                    Get help at <a href="mailto:support@ashaboutique.com" className="support-item__link">support@ashaboutique.com</a>
                  </p>
                </div>
              </div>

              <div className="support-item">
                <div className="support-item__icon">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="support-item__title">Phone Hotline</h4>
                  <p className="support-item__desc">
                    Call developer desk at <br />
                    <span className="font-semibold text-[#2B1E1A]">+91 98765 43210</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="help-card" style={{ backgroundColor: "#FDFCFB" }}>
              <h3 className="help-card__title" style={{ fontSize: "1.4rem" }}>Compliance & Rules</h3>
              <p className="help-card__subtitle">Guidelines on platform data management.</p>
              
              <ul style={{ padding: "0 0 0 1.25rem", margin: 0, listStyleType: "disc" }} className="text-xs text-[#7A655D] space-y-2">
                <li>Double check images limit sizes before triggering POST catalog requests.</li>
                <li>Make sure category choices match the primary Shop taxonomy strictly.</li>
                <li>Refunded order invoices must be audited before releasing database inventory.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;
