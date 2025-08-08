import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleRegister = async () => {
        if (!emailRegex.test(email)) {
            alert("Por favor ingresa un correo válido.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
console.log(import.meta.env.VITE_BACKEND_URL);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });


            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Usuario registrado correctamente.");
                navigate("/login");
            } else {
                alert(data.message || "Error en el registro.");
            }
        } catch (error) {
            alert("Fallo al conectar con el servidor: " + error.message);
        }
    };

    return (
        <>
            <div className="text-center mt-5">
                <h1 className="display-4">React + Flask Register</h1>
            </div>
            <div className="alert alert-info">
                <div className="mb-3 container">
                    <label htmlFor="registerEmail" className="form-label">Email address</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="form-control"
                        id="registerEmail"
                        placeholder="name@example.com"
                    />

                    <label htmlFor="registerPassword" className="form-label">Password</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        id="registerPassword"
                        className="form-control"
                    />

                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                    />
                </div>
            </div>
            <div className="text-center">
                <button
                    type="submit"
                    className="btn btn-primary mb-3"
                    onClick={handleRegister}
                >
                    Registrarse
                </button>
                <br />
                <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => navigate("/login")}
                >
                    ¿Ya tienes cuenta? Inicia sesión
                </button>
            </div>
        </>
    );
};
