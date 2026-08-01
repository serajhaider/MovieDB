function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">Movie<span className="brand-accent">DB</span></div>
        <p className="footer-sub">Complete MERN Stack Movie Platform &bull; React + Express + MongoDB + JWT + Google OAuth</p>
        <p className="footer-copy">&copy; {new Date().getFullYear()} Movie Database. Built for production deployment on Render &amp; Netlify.</p>
      </div>
    </footer>
  );
}

export default Footer;