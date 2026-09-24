import { useEffect } from "react";

const Logout = () => {
    useEffect(() => {
        window.localStorage.removeItem("token");
        window.location.reload();
    }, []);

    return <div style={{ maxWidth: "600px", margin: "0 auto", color: "#c6d8e8" }}>Logout successful.</div>;
};

export default Logout;