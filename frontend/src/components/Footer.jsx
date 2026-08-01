function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">🎬 Movie<span className="brand-accent">DB</span></div>
        <p className="footer-sub">Complete MERN Stack Movie Platform • React + Express + MongoDB + JWT + Google OAuth</p>
        <p className="footer-copy">© {new Date().getFullYear()} Movie Database. Built for production deployment on Render & Netlify.</p>
      </div>
    </footer>
  );
}

export default Footer;