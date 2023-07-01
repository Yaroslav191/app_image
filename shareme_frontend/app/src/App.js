import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './container/Home';
import { gapi } from 'gapi-script';

function App() {
    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_API_TOKEN,
                scopoe: '',
            });
        }

        gapi.load('client:auth2', start);
    });

    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="login" element={<Login />} />

                    <Route path="/*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
