import { Routes, Route } from "react-router-dom";
import AtelierIndex from "./pages/index.jsx";

function NotFound() {
  return (
    <div style={{ padding: 20 }}>
      <p>404 — Not found</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AtelierIndex />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
