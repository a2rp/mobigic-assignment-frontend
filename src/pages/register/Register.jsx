import { useEffect, useState } from "react";
import axios from "axios";
import { FiUserPlus } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const Register = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({ username: "", password: "", confirmPassword: "" });
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputs.username.trim().length < 3 || inputs.username.trim().length > 15) return setResponse("Username length must be between 3 and 15.");
        if (inputs.password.trim().length < 6) return setResponse("Password length must be at least 6.");
        if (inputs.password !== inputs.confirmPassword) return setResponse("Passwords do not match.");
        setLoading(true);
        setResponse("");
        axios.post("http://localhost:1198/api/register", inputs).then((result) => { setResponse(result.data.message); navigate("/login"); }).catch((error) => setResponse(error.response?.data?.message || error.message)).finally(() => setLoading(false));
    };

    useEffect(() => { if (window.localStorage.getItem("token")) navigate("/dashboard"); }, [navigate]);

    return <section className={styles.container}><form className={styles.formCard} onSubmit={handleSubmit}><h1 className={styles.title}>Create an account</h1><p className={styles.subtitle}>Start sharing files from one simple workspace.</p><div className={styles.field}><label htmlFor="username">Username</label><input className={styles.input} id="username" type="text" name="username" placeholder="Choose username" onChange={(event) => setInputs((prev) => ({ ...prev, username: event.target.value }))} value={inputs.username} required /></div><div className={styles.field}><label htmlFor="password">Password</label><input className={styles.input} id="password" type="password" name="password" placeholder="Create password" onChange={(event) => setInputs((prev) => ({ ...prev, password: event.target.value }))} value={inputs.password} required /></div><div className={styles.field}><label htmlFor="confirmPassword">Confirm password</label><input className={styles.input} id="confirmPassword" type="password" name="confirmPassword" placeholder="Repeat password" onChange={(event) => setInputs((prev) => ({ ...prev, confirmPassword: event.target.value }))} value={inputs.confirmPassword} required /></div><div className={styles.response} role="alert">{response}</div><button className={styles.submitButton} type="submit" disabled={loading}><FiUserPlus /> {loading ? "Creating..." : "Create account"}</button><p className={styles.note}>Already registered? <NavLink to="/login">Sign in</NavLink></p></form></section>;
};

export default Register;