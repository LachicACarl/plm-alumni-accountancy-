import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Batches from "./pages/Batches";
import Events from "./pages/Events";
import Alumni from "./pages/Alumni";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/batches" element={<Batches />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
