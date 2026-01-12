const Footer = () => {
  return (
    <footer className="border-t border-border bg-background px-8 py-6">
      <div className="mx-auto max-w-7xl text-center text-sm text-text-muted">
        © {new Date().getFullYear()} Advocate Automated. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
