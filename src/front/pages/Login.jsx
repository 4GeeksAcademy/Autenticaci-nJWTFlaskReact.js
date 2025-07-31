import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            console.log("URL del backend:", backendUrl);

            const response = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "omit",  // Evitar problemas de CORS con credenciales
            });

            console.log("Respuesta del servidor:", response.status);
            const data = await response.json();

            if (response.ok) {
                console.log("Login exitoso:", data);
                dispatch({
                    type: "login",
                    payload: {
                        user: {
                            id: data.user_id,
                            email: data.email
                        },
                        token: data.token
                    }
                });
                navigate("/private");
            } else {
                setError(data.message || "Error al iniciar sesión");
            }
        } catch (error) {
            setError("Error de conexión. Verifica que el backend esté funcionando.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Cargando..." : "Iniciar Sesión"}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <p>
                                    ¿No tienes cuenta?{" "}
                                    <Link to="/signup" className="text-decoration-none">
                                        Regístrate aquí
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
