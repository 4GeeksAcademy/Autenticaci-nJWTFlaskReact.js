import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Autenticación JWT</h1>
			<p className="lead">
				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" style={{ width: "150px" }} />
			</p>

			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-8">
						{store.token ? (
							// Usuario autenticado
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">¡Bienvenido de vuelta!</h5>
									<p className="card-text">
										Estás autenticado como: <strong>{store.user?.email}</strong>
									</p>
									<Link to="/private" className="btn btn-primary">
										Ir al Área Privada
									</Link>
								</div>
							</div>
						) : (
							// Usuario no autenticado
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">Sistema de Autenticación JWT</h5>
									<p className="card-text">
										Esta aplicación demuestra cómo implementar autenticación JWT
										con Flask (backend) y React (frontend).
									</p>
									<div className="d-flex justify-content-center gap-3">
										<Link to="/login" className="btn btn-primary">
											Iniciar Sesión
										</Link>
										<Link to="/signup" className="btn btn-outline-primary">
											Crear Cuenta
										</Link>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="alert alert-info mt-4">
				{store.message ? (
					<span>Backend conectado: {store.message}</span>
				) : (
					<span className="text-danger">
						Conectando con el backend...
					</span>
				)}
			</div>
		</div>
	);
}; 