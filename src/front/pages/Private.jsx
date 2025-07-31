import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Private = () => {
    const [privateMessage, setPrivateMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        const loadPrivateData = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;

                if (!store.token) {
                    navigate("/login");
                    return;
                }

                console.log("Token usado para autenticación:", store.token);
                const response = await fetch(`${backendUrl}/api/private`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${store.token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "omit",  // Evitar problemas de CORS con credenciales
                });
                console.log("Respuesta del backend:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    setPrivateMessage(data.message);
                } else if (response.status === 401) {
                    // Token inválido o expirado
                    dispatch({ type: "logout" });
                    navigate("/login");
                } else {
                    console.error("Error al cargar datos privados:", response.status);
                    const errorData = await response.text();
                    console.error("Detalles:", errorData);
                    setError(`Error al cargar datos privados (${response.status})`);
                }
            } catch (error) {
                setError("Error de conexión");
            } finally {
                setLoading(false);
            }
        };

        loadPrivateData();
    }, [store.token, navigate, dispatch]);

    const handleLogout = () => {
        dispatch({ type: "logout" });
        navigate("/");
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Área Privada</h2>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            {store.user && (
                                <div className="alert alert-info">
                                    <h5>¡Bienvenido!</h5>
                                    <p><strong>Email:</strong> {store.user.email}</p>
                                    <p><strong>ID:</strong> {store.user.id}</p>
                                </div>
                            )}

                            {privateMessage && (
                                <div className="alert alert-success">
                                    <h6>Mensaje del servidor:</h6>
                                    <p>{privateMessage}</p>
                                </div>
                            )}

                            <div className="text-center">
                                <button
                                    className="btn btn-danger"
                                    onClick={handleLogout}
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
