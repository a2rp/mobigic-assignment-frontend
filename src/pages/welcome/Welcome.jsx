import { useEffect, useState } from "react";
import axios from "axios";
import { FiDownload, FiFolder } from "react-icons/fi";
import styles from "./styles.module.scss";

const Welcome = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAllFiles = async () => {
            try {
                const response = await axios.get("http://localhost:1198/api/file/all-files");
                setFiles(response.data.files || []);
            } catch (error) {
                setFiles([]);
            } finally {
                setLoading(false);
            }
        };
        getAllFiles();
    }, []);

    return (
        <section className={styles.container}>
            <div className={styles.heading}><div><span className={styles.eyebrow}><FiFolder /> Shared files</span><h1 className={styles.title}>Public file gallery</h1><p className={styles.subtitle}>Browse shared files and use a unique code to download them securely.</p></div></div>
            <div className={styles.files}>
                {loading ? <div className={styles.loading}>Loading shared files...</div> : files.length === 0 ? <div className={styles.empty}>No shared files are available right now.</div> : <table><thead><tr><th>Unique code</th><th>File name</th><th>Download</th></tr></thead><tbody>{files.map((file) => <tr key={file._id}><td>{file.code}</td><td>{file.file}</td><td><a href={`${process.env.PUBLIC_URL}/download-file/${file._id}`}><FiDownload /> Open download</a></td></tr>)}</tbody></table>}
            </div>
        </section>
    );
};

export default Welcome;