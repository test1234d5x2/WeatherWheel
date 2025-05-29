import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/main.css';
import './css/index.css';
import './css/forecast.css';
import './css/recommendations.css';
import './css/carousel.css';
import 'leaflet/dist/leaflet.css';
import { Container } from './Container';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';


const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <Container />
            </Router>
        </Provider>
    </React.StrictMode>
);