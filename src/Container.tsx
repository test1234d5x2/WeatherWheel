import { Main } from "./Main";
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Map } from "./Map";

export const Container: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="main-container">
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
            <main className="app-content">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/map" element={<Map />} />
                </Routes>
            </main>
        </div>
    );
};
