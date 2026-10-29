import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/vulnerable/Home";
import Login from "./pages/vulnerable/Login";
import Register from "./pages/vulnerable/Register";
import Contact from "./pages/vulnerable/Contact";
import Admin from "./pages/vulnerable/Admin";
import Dashboard from "./pages/vulnerable/Dashboard";
import EmployeeProfile from "./pages/vulnerable/EmployeeProfile";
import Employees from "./pages/vulnerable/Employees";
import Projects from "./pages/vulnerable/Projects";
import Search from "./pages/vulnerable/Search";
import Messages from "./pages/vulnerable/Messages";
import Reports from "./pages/vulnerable/Reports";
import Settings from "./pages/vulnerable/Settings";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Standard routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employee/:id" element={<EmployeeProfile />} />
                <Route path="/employees/:id" element={<EmployeeProfile />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/search" element={<Search />} />
                <Route path="/search/:query" element={<Search />} />
                <Route path="/search/*" element={<Search />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />

                {/* Subpath /lab routes used by component navigation links */}
                <Route path="/lab" element={<Home />} />
                <Route path="/lab/dashboard" element={<Dashboard />} />
                <Route path="/lab/login" element={<Login />} />
                <Route path="/lab/register" element={<Register />} />
                <Route path="/lab/contact" element={<Contact />} />
                <Route path="/lab/admin" element={<Admin />} />
                <Route path="/lab/employees" element={<Employees />} />
                <Route path="/lab/employee/:id" element={<EmployeeProfile />} />
                <Route path="/lab/employees/:id" element={<EmployeeProfile />} />
                <Route path="/lab/projects" element={<Projects />} />
                <Route path="/lab/search" element={<Search />} />
                <Route path="/lab/search/:query" element={<Search />} />
                <Route path="/lab/search/*" element={<Search />} />
                <Route path="/lab/messages" element={<Messages />} />
                <Route path="/lab/reports" element={<Reports />} />
                <Route path="/lab/settings" element={<Settings />} />

                {/* Catch-all fallback */}
                <Route path="*" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;