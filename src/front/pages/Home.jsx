import { useNavigate } from "react-router-dom";

export const Home = () => {
	const navigate = useNavigate();
	return (
		<>
			<div className="text-center mt-5">
				<h1 className="display-4">Bienvenido</h1>
				<p>Selecciona una opción:</p>
				<button
					className="btn btn-primary m-2"
					onClick={() => navigate("/login")}
				>
					Login
				</button>
				<button
					className="btn btn-secondary m-2"
					onClick={() => navigate("/register")}
				>
					Register
				</button>
			</div>
		</>
	);
};