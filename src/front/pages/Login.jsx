import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleLogin = async () => {
        if (!emailRegex.test(email)) {
            alert("Por favor ingresa un correo válido.");
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                console.log(data.message);
                localStorage.setItem("token", data.data.token);
                navigate('/dashboard')
            } else {
                alert(data.message || "Error en el login");
            }
        } catch (err) {
            alert(err.message)
        }
    };

    return (
        <>
            <div className="text-center mt-5">
                <h1 className="display-4">React+FLask Login</h1>
            </div>
            <div className="alert alert-info">
                <div className="mb-3 container">
                    <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />

                    <label htmlFor="inputPassword5" className="form-label">Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" id="inputPassword5" className="form-control" aria-describedby="passwordHelpBlock" />
                </div>
            </div>
            <div className="text-center">
                <button
                    type="submit"
                    className="btn btn-primary mb-3"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <br />
                <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => navigate("/register")}
                >
                    ¿No tienes cuenta? Regístrate
                </button>
            </div>
        </>
    );
};