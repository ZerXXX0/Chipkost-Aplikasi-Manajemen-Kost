
import { useState } from "react"

const NavButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={[
      "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
      active ? "bg-white text-gray-900 shadow-md" : "text-white/90 hover:bg-white/10",
    ].join(" ")}
  >
    {children}
  </button>
)

const Navigation = () => {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <nav className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-6">
        <NavButton active={activeTab === "home"} onClick={() => setActiveTab("home")}>
          Home
        </NavButton>
        <NavButton active={activeTab === "fitur"} onClick={() => setActiveTab("fitur")}>
          Fitur
        </NavButton>
        <NavButton active={activeTab === "service"} onClick={() => setActiveTab("service")}>
          Customer Service
        </NavButton>
      </div>
    </nav>
  )
}

export default Navigation
