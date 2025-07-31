import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();

	const handleLogout = () => {
		dispatch({ type: "logout" });
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container">
				<Link to="/" className="navbar-brand">
					JWT Authentication
				</Link>

				<div className="navbar-nav ms-auto">
					{store.token ? (
						// usuario autenticado
						<div className="d-flex align-items-center">
							<span className="navbar-text me-3">
								¡Hola, {store.user?.email}!
							</span>
							<Link to="/private" className="btn btn-outline-primary me-2">
								Área Privada
							</Link>
							<button
								className="btn btn-outline-danger"
								onClick={handleLogout}
							>
								Cerrar Sesión
							</button>
						</div>
					) : (
						// esto es para un usuario no autenticado
						<div className="d-flex">
							<Link to="/login" className="btn btn-outline-primary me-2">
								Iniciar Sesión
							</Link>
							<Link to="/signup" className="btn btn-primary">
								Registrarse
							</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};