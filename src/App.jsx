import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirectRoute from './components/AuthRedirectRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewOrder from './pages/NewOrder';
import OrderDetail from './pages/OrderDetail';
import Clients from './pages/Clients';
import About from './pages/About';
import './App.css';

const API_URL = 'http://localhost:4000/api';

// Helper to upload base64 photos as files to the server
const uploadPhotos = async (base64Photos) => {
  // Filter out already-uploaded photos (they start with /uploads/ or http)
  const newPhotos = base64Photos.filter(p => p.startsWith('data:'));
  const existingPhotos = base64Photos.filter(p => !p.startsWith('data:'));

  if (newPhotos.length === 0) {
    return base64Photos; // nothing new to upload
  }

  try {
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: newPhotos }),
    });

    if (!res.ok) throw new Error('Error uploading');

    const { paths } = await res.json();
    return [...existingPhotos, ...paths];
  } catch (err) {
    console.error('Error subiendo fotos:', err);
    return base64Photos; // fallback to base64 if upload fails
  }
};

function AppContent() {
  const navigate = useNavigate();

  // Estado global
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = currentUser !== null;

  // Cargar datos iniciales desde la API
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/clientes`),
        fetch(`${API_URL}/ordenes`),
      ]);
      const clientsData = await clientsRes.json();
      const ordersData = await ordersRes.json();
      setClients(clientsData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Funciones de autenticación
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();
      setCurrentUser(data.user);
      return true;
    } catch (err) {
      console.error('Error en login:', err);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setClients([]);
    setOrders([]);
    navigate('/login');
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (res.status === 409) {
        return { success: false, error: 'email_exists' };
      }

      if (!res.ok) {
        return { success: false, error: 'server_error' };
      }

      return { success: true };
    } catch (err) {
      console.error('Error en registro:', err);
      return { success: false, error: 'server_error' };
    }
  };

  // Funciones de gestión de datos
  const addOrder = async (orderData) => {
    try {
      // Upload photos first, if upload fails, create order without photos
      if (orderData.fotos_recepcion && orderData.fotos_recepcion.length > 0) {
        try {
          orderData.fotos_recepcion = await uploadPhotos(orderData.fotos_recepcion);
        } catch (e) {
          console.warn('No se pudieron subir las fotos, creando orden sin fotos');
          orderData.fotos_recepcion = [];
        }
      } else {
        orderData.fotos_recepcion = [];
      }

      const res = await fetch(`${API_URL}/ordenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error('Error creando orden');

      const newOrder = await res.json();
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      console.error('Error creando orden:', err);
      return null;
    }
  };

  const updateOrder = async (id, updates) => {
    try {
      // Upload any new photos
      if (updates.fotos_recepcion && updates.fotos_recepcion.length > 0) {
        updates.fotos_recepcion = await uploadPhotos(updates.fotos_recepcion);
      }
      if (updates.fotos_entrega && updates.fotos_entrega.length > 0) {
        updates.fotos_entrega = await uploadPhotos(updates.fotos_entrega);
      }

      const res = await fetch(`${API_URL}/ordenes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Error actualizando orden');

      const updatedOrder = await res.json();
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );
      return updatedOrder;
    } catch (err) {
      console.error('Error actualizando orden:', err);
      return null;
    }
  };

  const addClient = async (clientData) => {
    try {
      const res = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });

      if (!res.ok) throw new Error('Error creando cliente');

      const newClient = await res.json();
      setClients((prev) => [...prev, newClient]);
      return newClient;
    } catch (err) {
      console.error('Error creando cliente:', err);
      return null;
    }
  };

  const deleteOrder = async (id) => {
    try {
      const res = await fetch(`${API_URL}/ordenes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando orden');
      setOrders((prev) => prev.filter((order) => order.id !== id));
      return true;
    } catch (err) {
      console.error('Error eliminando orden:', err);
      return false;
    }
  };

  const deleteClient = async (id) => {
    try {
      const res = await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando cliente');
      setClients((prev) => prev.filter((client) => client.id !== id));
      return true;
    } catch (err) {
      console.error('Error eliminando cliente:', err);
      return false;
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      const res = await fetch(`${API_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      if (!res.ok) throw new Error('Error actualizando cliente');
      const updated = await res.json();
      setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err) {
      console.error('Error actualizando cliente:', err);
      return null;
    }
  };

  return (
    <div className="app">
      <AnimatedBackground />
      <Navbar
        isAuthenticated={isAuthenticated}
        userName={currentUser ? currentUser.nombre : ''}
        onLogout={logout}
      />
      <main className="app-main">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Rutas con redirect si autenticado */}
          <Route
            path="/login"
            element={
              <AuthRedirectRoute isAuthenticated={isAuthenticated}>
                <Login onLogin={login} isAuthenticated={isAuthenticated} />
              </AuthRedirectRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRedirectRoute isAuthenticated={isAuthenticated}>
                <Register onRegister={register} isAuthenticated={isAuthenticated} />
              </AuthRedirectRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard orders={orders} clients={clients} loading={loading} onDeleteOrder={deleteOrder} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nueva-orden"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <NewOrder
                  clients={clients}
                  orders={orders}
                  onAddOrder={addOrder}
                  onAddClient={addClient}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orden/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <OrderDetail orders={orders} onUpdateOrder={updateOrder} onDeleteOrder={deleteOrder} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Clients clients={clients} loading={loading} onDeleteClient={deleteClient} onUpdateClient={updateClient} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
