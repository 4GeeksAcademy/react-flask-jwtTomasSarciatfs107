import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    
    useEffect(() => {
        const token = localStorage.getItem("token");
console.log(token)
        if (!token) {
            navigate("/login");
            return;
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/protected`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Token inválido o expirado");
                return res.json();
            })
            .then((data) => {
                setUserData(data);
            })
            .catch((err) => {
                console.error("Sesión inválida:", err.message);
                localStorage.removeItem("token");
                navigate("/login");
            });
    }, []);

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
            <h1 className="display-4 text-primary mb-4">Dashboard protegido</h1>
            {userData && (
                <p className="lead text-secondary mb-3">
                    Bienvenido: <strong>{userData.email}</strong>
                </p>
            )}
            <button
                className="btn btn-danger"
                onClick={handleLogout}
            >
                Cerrar sesión
            </button>
        </div>
    );
};

export default Dashboard;
