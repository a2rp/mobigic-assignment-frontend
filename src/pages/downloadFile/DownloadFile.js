import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DownloadFile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Requesting download code...");

    useEffect(() => {
        let isActive = true;
        const downloadURLFile = async () => {
            const code = window.prompt("Please enter the unique code:", "");
            if (!code) { if (isActive) setStatus("Unique code not found."); return; }
            if (isActive) setStatus("Downloading file. Please wait...");
            try {
                const response = await axios.get(`http://localhost:1198/api/file/url-download/${id}/${code}`, { responseType: "arraybuffer" });
                const blob = new Blob([response.data], { type: response.headers["content-type"] });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                const contentDisposition = response.headers["content-disposition"] || "";
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                link.download = match?.[1] || "downloaded-file";
                link.click();
                window.URL.revokeObjectURL(link.href);
            } catch (error) {
                if (isActive) setStatus(error.response?.data?.message || error.message);
            } finally {
                if (isActive) navigate("/home");
            }
        };
        downloadURLFile();
        return () => { isActive = false; };
    }, [id, navigate]);

    return <div style={{ maxWidth: "600px", margin: "0 auto", color: "#c6d8e8" }}>{status}</div>;
};

export default DownloadFile;