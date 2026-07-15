import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import {
  BookOpen,
  MessageSquare,
  ListMusic,
  BrainCircuit,
  Languages,
  BarChart2,
  Settings,
  GraduationCap,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

import DailyLessons from "./pages/DailyLessons";
import ChatTutor from "./pages/ChatTutor";
import Alphabet from "./pages/Alphabet";
import Vocabulary from "./pages/Vocabulary";
import Translator from "./pages/Translator";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/Settings";


export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-[#FBFBF9] text-[#1A1A1A] font-sans">

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-white p-3 rounded-xl"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 h-full w-64 bg-white border-r border-[#E5E5E1] z-50 transform transition-transform duration-300 md:hidden flex flex-col",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-6 flex justify-between items-center border-b border-[#E5E5E1]">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-black text-xl">Cervantes AI</h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase">
                  Personal Tutor
                </p>
              </div>
            </div>

            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <NavItem to="/" icon={<BookOpen />} label="Daily Lesson" closeSidebar={() => setSidebarOpen(false)} />
            <NavItem to="/chat" icon={<MessageSquare />} label="Chat Tutor" closeSidebar={() => setSidebarOpen(false)} />
            <NavItem to="/vocabulary" icon={<BrainCircuit />} label="Vocabulary" closeSidebar={() => setSidebarOpen(false)} />
            <NavItem to="/alphabet" icon={<ListMusic />} label="Alphabet" closeSidebar={() => setSidebarOpen(false)} />
            <NavItem to="/translator" icon={<Languages />} label="Translator" closeSidebar={() => setSidebarOpen(false)} />
            <NavItem to="/dashboard" icon={<BarChart2 />} label="Dashboard" closeSidebar={() => setSidebarOpen(false)} />
            <NavItem to="/settings" icon={<Settings />} label="Settings" closeSidebar={() => setSidebarOpen(false)} />
          </nav>
        </aside>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 border-r border-[#E5E5E1] bg-white flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-[#E5E5E1]">
            <div className="bg-black p-2 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="font-black text-xl leading-none tracking-tight">
                Cervantes AI
              </h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                Personal Tutor
              </p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem to="/" icon={<BookOpen />} label="Daily Lesson" />
            <NavItem to="/chat" icon={<MessageSquare />} label="Chat Tutor" />
            <NavItem to="/vocabulary" icon={<BrainCircuit />} label="Vocabulary" />
            <NavItem to="/alphabet" icon={<ListMusic />} label="Alphabet" />
            <NavItem to="/translator" icon={<Languages />} label="Translator" />
            <NavItem to="/dashboard" icon={<BarChart2 />} label="Dashboard" />
          </nav>

          <div className="p-4 border-t border-[#E5E5E1]">
            <NavItem to="/settings" icon={<Settings />} label="Settings" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<DailyLessons />} />
            <Route path="/chat" element={<ChatTutor />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/alphabet" element={<Alphabet />} />
            <Route path="/translator" element={<Translator />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavItem({
  to,
  icon,
  label,
  closeSidebar
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  closeSidebar?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={closeSidebar}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
          isActive
            ? "bg-[#F0F0EE] text-black"
            : "text-gray-400 hover:bg-[#F0F0EE] hover:text-black"
        )
      }
    >
      <div className="w-5 h-5 flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4">
        {icon}
      </div>
      {label}
    </NavLink>
  );
}
