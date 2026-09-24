import { useEffect, useRef, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { FiArrowUp, FiCoffee, FiCode, FiFacebook, FiGithub, FiGlobe, FiHeart, FiLinkedin, FiMail, FiMenu, FiMessageCircle, FiX, FiYoutube } from "react-icons/fi";
import "./App.css";
import styles from "./styles.module.scss";
import { Welcome, Login, Register, Dashboard, Logout } from "./pages";
import DownloadFile from "./pages/downloadFile/DownloadFile";

const links = [
    { label: "Portfolio", href: "https://www.ashishranjan.net/", Icon: FiGlobe }, { label: "GitHub", href: "https://github.com/a2rp", Icon: FiGithub },
    { label: "CodePen", href: "https://codepen.io/ash1198", Icon: FiCode }, { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", Icon: FiLinkedin },
    { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", Icon: FiFacebook }, { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", Icon: FiYoutube },
    { label: "Email", href: "mailto:ash.ranjan09@gmail.com", Icon: FiMail },
];
const supportLinks = [
    { label: "Support", href: "https://a2rp-donation-page.netlify.app/", Icon: FiMessageCircle }, { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/a2rp", Icon: FiCoffee },
    { label: "Patreon", href: "https://www.patreon.com/a2rp", Icon: FiHeart },
];

function Application() {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showTopButton, setShowTopButton] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const syncUser = () => setUserLoggedIn(Boolean(window.localStorage.getItem("token")));
        const handleScroll = () => setShowTopButton(window.scrollY > 320);
        syncUser();
        window.addEventListener("storage", syncUser);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => { window.removeEventListener("storage", syncUser); window.removeEventListener("scroll", handleScroll); };
    }, []);

    useEffect(() => setMenuOpen(false), [location.pathname]);

    useEffect(() => {
        const handleOutsideClick = (event) => { if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false); };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [menuOpen]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const linkClass = ({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`;

    return (
        <div className={styles.container}>
            <header className={styles.headerContainer} ref={menuRef}>
                <NavLink to="/home" className={styles.appName}><img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Ashish Ranjan logo" /><span><strong>File Gallery</strong><small>Upload and share files</small></span></NavLink>
                <button className={styles.menuButton} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <FiX /> : <FiMenu />}</button>
                <nav className={`${styles.navLinksContainer} ${menuOpen ? styles.open : ""}`} aria-label="Primary navigation">
                    <NavLink className={linkClass} to="/home">HOME</NavLink>
                    {userLoggedIn ? <><NavLink className={linkClass} to="/dashboard">DASHBOARD</NavLink><NavLink className={linkClass} to="/logout">LOG OUT</NavLink></> : <><NavLink className={linkClass} to="/login">LOGIN</NavLink><NavLink className={linkClass} to="/register">REGISTER</NavLink></>}
                </nav>
            </header>

            <main className={styles.contentContainer}>
                <Routes>
                    <Route path="/" element={<Welcome />} /><Route path="/home" element={<Welcome />} /><Route path="/register" element={<Register />} /><Route path="/login" element={<Login />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/logout" element={<Logout />} /><Route path="/download-file/:id" element={<DownloadFile />} />
                </Routes>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerIntro}><span className={styles.footerTitle}><FiGlobe /> File Gallery</span><p>Keep file sharing simple, clear and easy to use.</p></div>
                <div className={styles.footerGroups}><div><span className={styles.footerLabel}>Connect</span><div className={styles.iconLinks}>{links.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Icon /></a>)}</div></div><div><span className={styles.footerLabel}>Support</span><div className={styles.iconLinks}>{supportLinks.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Icon /></a>)}</div></div></div>
                <div className={styles.footerBottom}>Copyright Ãƒâ€šÃ‚Â© {new Date().getFullYear()} <a href="https://www.ashishranjan.net/" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a></div>
            </footer>
            {showTopButton && <button className={styles.topButton} type="button" aria-label="Scroll to top" title="Scroll to top" onClick={scrollToTop}><FiArrowUp /></button>}
        </div>
    );
}

function App() {
    return <Application />;
}

export default App;