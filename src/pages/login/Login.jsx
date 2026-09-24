import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FiLogIn } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const Login = () => {
    const navigate = useNavigate();
    const submitButton = useRef(null);
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputs.username.trim().length < 3 || inputs.username.trim().length > 15) return setResponse("Username length must be between 3 and 15.");
        if (inputs.password.trim().length < 6) return setResponse("Password length must be at least 6.");
        setLoading(true);
        setResponse("");
        axios.post("http://localhost:1198/api/login", inputs).then((result) => {
            if (result.data.success === true) {
                window.localStorage.clear();
                window.localStorage.setItem("token", result.data.token);
                navigate("/dashboard");
                window.location.reload();
            } else setResponse(result.data.message);
        }).catch((error) => setResponse(error.response?.data?.message || error.message)).finally(() => setLoading(false));
    };

    useEffect(() => {
        if (window.localStorage.getItem("token")) navigate("/dashboard");
    }, [navigate]);

    return <section className={styles.container}><form className={styles.formCard} onSubmit={handleSubmit}><h1 className={styles.title}>Welcome back</h1><p className={styles.subtitle}>Sign in to manage your shared files.</p><div className={styles.field}><label htmlFor="username">Username</label><input className={styles.input} id="username" type="text" name="username" placeholder="Enter username" onChange={(event) => setInputs((prev) => ({ ...prev, username: event.target.value }))} value={inputs.username} required /></div><div className={styles.field}><label htmlFor="password">Password</label><input className={styles.input} id="password" type="password" name="password" placeholder="Enter password" onChange={(event) => setInputs((prev) => ({ ...prev, password: event.target.value }))} value={inputs.password} required /></div><div className={styles.response} role="alert">{response}</div><button ref={submitButton} className={styles.submitButton} type="submit" disabled={loading}><FiLogIn /> {loading ? "Signing in..." : "Sign in"}</button><p className={styles.note}>New here? <NavLink to="/register">Create an account</NavLink></p></form></section>;
};

export default Login;