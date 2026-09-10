import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container grid grid-cols-4" style={styles.grid}>
        <div>
          <h3 style={styles.brand}>
            <span style={styles.logoIcon}>+</span>
            صيدلية الأمل
          </h3>
          <p style={styles.text}>
            رعايتك الصحية هي أولويتنا. نوفر لك أفضل الأدوية والمستلزمات الطبية بأعلى معايير الجودة وموثوقية مضمونة.
          </p>
        </div>

        <div>
          <h4 style={styles.heading}>روابط سريعة</h4>
          <ul style={styles.list}>
            <li><Link to="/" style={styles.link}>الرئيسية</Link></li>
            <li><Link to="/shop" style={styles.link}>المتجر</Link></li>
            <li><Link to="/about" style={styles.link}>من نحن</Link></li>
            <li><Link to="/contact" style={styles.link}>اتصل بنا</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={styles.heading}>خدمة العملاء</h4>
          <ul style={styles.list}>
            <li><Link to="/faq" style={styles.link}>الأسئلة الشائعة</Link></li>
            <li><Link to="/shipping" style={styles.link}>سياسة التوصيل</Link></li>
            <li><Link to="/returns" style={styles.link}>سياسة الاسترجاع</Link></li>
            <li><Link to="/privacy" style={styles.link}>سياسة الخصوصية</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={styles.heading}>تواصل معنا</h4>
          <p style={styles.text}>المملكة العربية السعودية، الرياض</p>
          <p style={styles.text}>الهاتف: +966 50 123 4567</p>
          <p style={styles.text}>البريد: info@alamalpharmacy.com</p>
          <div style={styles.socials}>
            <a href="#" style={styles.socialLink}><FaFacebook size={24}/></a>
            <a href="#" style={styles.socialLink}><FaTwitter size={24}/></a>
            <a href="#" style={styles.socialLink}><FaInstagram size={24}/></a>
            <a href="#" style={styles.socialLink}><FaWhatsapp size={24}/></a>
          </div>
        </div>
      </div>
      
      <div style={styles.bottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} صيدلية الأمل. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#111827', // Gray 900
    color: '#D1D5DB', // Gray 300
    paddingTop: '4rem',
    marginTop: 'auto'
  },
  grid: {
    paddingBottom: '3rem',
    gap: '2rem'
  },
  brand: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: '800',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  logoIcon: {
    backgroundColor: 'var(--primary)',
    color: 'white',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem'
  },
  heading: {
    color: 'white',
    fontSize: '1.125rem',
    fontWeight: '700',
    marginBottom: '1.25rem',
    position: 'relative',
    paddingBottom: '0.5rem'
  },
  text: {
    marginBottom: '0.75rem',
    lineHeight: '1.6'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  link: {
    transition: 'color 0.2s',
  },
  socials: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  socialLink: {
    color: '#D1D5DB',
    transition: 'color 0.2s, transform 0.2s'
  },
  bottom: {
    backgroundColor: '#030712', // Gray 950
    padding: '1.5rem 0',
    textAlign: 'center',
    fontSize: '0.875rem'
  }
};
