import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FiTrash2, FiUpload, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import styles from "./styles.module.scss";

const Dashboard = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const token = window.localStorage.getItem("token") || "";
    const [user, setUser] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) { navigate("/login"); return; }
        axios.post("http://localhost:1198/api/user", { idToken: `Bearer ${token}` }).then((response) => {
            if (response.data.user) setUser(response.data.user.username);
        }).catch(() => navigate("/login"));
    }, [navigate, token]);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        axios.post("http://localhost:1198/api/file/files", { user }).then((response) => setFiles(response.data.files || [])).catch(() => setFiles([])).finally(() => setLoading(false));
    }, [user]);

    const uploadFile = async (event) => {
        event.preventDefault();
        const selectedFile = fileInputRef.current?.files?.[0];
        if (!selectedFile) return;
        try {
            const formData = new FormData();
            formData.append("id", user);
            formData.append("name", uuid().slice(0, 6));
            formData.append("file", selectedFile);
            const response = await axios.post("http://localhost:1198/api/file/upload", formData);
            if (response.data.response.file) window.location.reload();
        } catch (error) { window.alert(error.response?.data?.message || error.message); }
    };

    const deleteFile = async (id, code) => {
        if (!window.confirm(`Delete file with code: ${code}`)) return;
        try {
            const response = await axios.post(`http://localhost:1198/api/file/delete/${id}`);
            if (response.data.success) setFiles((currentFiles) => currentFiles.filter((file) => file._id !== id));
        } catch (error) { window.alert(error.response?.data?.message || error.message); }
    };

    return <section className={styles.container}>{user && <div className={styles.userContent}><div className={styles.greeting}><FiUser /> Hi, {user}</div><hr className={styles.divider} /><form className={styles.uploadFile} onSubmit={uploadFile}><input className={styles.fileInput} type="file" ref={fileInputRef} /><button className={styles.uploadSubmit} type="submit"><FiUpload /> Upload file</button></form><div className={styles.files}>{loading ? <div className={styles.empty}>Loading your files...</div> : files.length === 0 ? <div className={styles.empty}>No files uploaded yet.</div> : <table><thead><tr><th>Unique code</th><th>File name</th><th>Actions</th></tr></thead><tbody>{files.map((file) => <tr key={file._id}><td>{file.code}</td><td>{file.file.split("api\\uploads\\").pop()}</td><td><button className={styles.delete} type="button" onClick={() => deleteFile(file._id, file.code)}><FiTrash2 /> Delete</button></td></tr>)}</tbody></table>}</div></div>}</section>;
};

export default Dashboard;