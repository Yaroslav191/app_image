import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './container/Home';
import { gapi } from 'gapi-script';

const App = () => {
    let navigate = useNavigate();

    useEffect(() => {
        const User =
            localStorage.getItem('user') !== 'undefined'
                ? JSON.parse(localStorage.getItem('user'))
                : localStorage.clear();

        if (!User) navigate('/login');

        function start() {
            gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_API_TOKEN,
                scopoe: '',
            });
        }

        gapi.load('client:auth2', start);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="app">
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="/*" element={<Home />} />
            </Routes>
        </div>
    );
};

export default App;
