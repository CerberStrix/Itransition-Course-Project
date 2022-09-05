import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './components/Home';
import Registration from './components/Registration';
import Login from './components/Login';
import UserPage from './components/UserPage';
import AuthContext from './contexts/AuthContext.jsx';

import axios from "axios";
import Collection from './components/Collection.jsx'
import ItemForm from './components/ItemForm';


const ProtectedRoute = ({
  isAllowed,
  redirectPath = '/home',
  children,
}) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  const [authState, setAuthState] = useState({ id: 0, email: '', name: '', permission: 'guest' });

  const logIn = (data) => {
    localStorage.setItem('accessToken', data.token);
      setAuthState({ id: data.id, email: data.email, name: data.name, permission: data.permission });
  };
  const logOut = () => {
    localStorage.removeItem('accessToken');
    setAuthState({ id: 0, email: '', name: 'Guest', permission: 'guest' });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/authentification/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState(authState);
        } else {
          setAuthState({
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            permission: response.data.permission,
          });
        }
      });
  }, []);

  return (
    <div className="App">
      <Router>
      <AuthContext.Provider value={{ authState, logIn, logOut }}>
        <Navigation/>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/user" element={
            <ProtectedRoute redirectPath="/home" isAllowed={authState.permission === 'user'}>
              <UserPage />
            </ProtectedRoute>} />    
          <Route path="/user/:collectionId" element={<Collection />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </AuthContext.Provider>
    </Router>
    </div>
  );
}

export default App;
