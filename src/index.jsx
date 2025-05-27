import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/main.css';
import './css/mainMobile.css'
import './css/index.css';
import './css/header.css';
import './css/forecast.css';
import './css/recommendations.css';
import './css/carousel.css';
import './css/dateAndTime.css';
import 'leaflet/dist/leaflet.css';
import { Container } from './Container';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Container />
);
