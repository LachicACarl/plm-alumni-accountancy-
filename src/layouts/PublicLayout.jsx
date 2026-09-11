import Navbar from "../components/Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f5ee]">
      <Navbar />
      {children}
    </div>
  );
}
