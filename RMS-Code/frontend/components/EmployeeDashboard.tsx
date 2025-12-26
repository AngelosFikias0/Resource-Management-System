import {
  Building2,
  CheckCircle,
  FileText,
  LogOut,
  Menu,
  Package,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MyResources } from "./employee/MyResources";
import OtherMunicipalityResources from "./employee/OtherMunicipalityResources";
import PendingApprovals from "./employee/PendingApprovals";
import Reports from "./employee/Reports";
import { ResourceRegistration } from "./employee/ResourceRegistration";

interface EmployeeDashboardProps {
  onLogout: () => void;
  userName?: string;
  municipalityName?: string;
}

type View =
  | "register"
  | "my-resources"
  | "other-resources"
  | "approvals"
  | "reports";

// Z-index system
const Z_INDEX = {
  overlay: 30,
  sidebar: 40,
  header: 50,
} as const;

export function EmployeeDashboard({
  onLogout,
  userName = "Υπάλληλος Δήμου",
  municipalityName = "Δήμος Αθηναίων",
}: EmployeeDashboardProps) {
  const [currentView, setCurrentView] = useState<View>("register");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "register" as const, icon: Upload, label: "Καταγραφή Πόρων" },
    { id: "my-resources" as const, icon: Package, label: "Οι Πόροι Μου" },
    {
      id: "other-resources" as const,
      icon: Building2,
      label: "Πόροι Άλλων Δήμων",
    },
    {
      id: "approvals" as const,
      icon: CheckCircle,
      label: "Εκκρεμείς Αιτήσεις",
    },
    { id: "reports" as const, icon: FileText, label: "Αναφορές" },
  ];

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Close mobile menu on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    closeMobileMenu();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header
        className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0"
        style={{ zIndex: Z_INDEX.header }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={
                  isMobileMenuOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"
                }
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-sidebar"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Efficiencity
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-white font-medium">{userName}</p>
                <p className="text-sm text-gray-300">{municipalityName}</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                aria-label="Αποσύνδεση από το σύστημα"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Αποσύνδεση</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside
          id="mobile-sidebar"
          className={`
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            fixed lg:static
            inset-y-0 left-0
            w-64
            bg-white/5 backdrop-blur-lg
            border-r border-white/10
            transition-transform duration-300
            pt-20 lg:pt-0
          `}
          style={{ zIndex: Z_INDEX.sidebar }}
          aria-label="Πλοήγηση"
        >
          <nav className="p-4 space-y-2" role="navigation">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/50 lg:hidden transition-opacity"
            style={{ zIndex: Z_INDEX.overlay }}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-73px)]">
          <div className="max-w-full">
            {currentView === "register" && <ResourceRegistration />}
            {currentView === "my-resources" && <MyResources />}
            {currentView === "other-resources" && (
              <OtherMunicipalityResources />
            )}
            {currentView === "approvals" && <PendingApprovals />}
            {currentView === "reports" && <Reports />}
          </div>
        </main>
      </div>
    </div>
  );
}
