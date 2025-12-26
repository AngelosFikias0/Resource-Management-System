import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UserType } from "../App";

// Configuration
const SUPPORT_EMAIL = "support@efficiencity.gr";

const USER_TYPES_CONFIG = [
  {
    type: "employee" as const,
    title: "Υπάλληλος Δήμου",
    description: "Καταγραφή, αίτηση, έγκριση και διαχείριση πόρων",
    icon: Building2,
    gradient: "from-blue-500 to-cyan-500",
    hoverBorder: "hover:border-blue-400",
  },
  {
    type: "citizen" as const,
    title: "Πολίτης",
    description: "Προβολή στατιστικών, διαθέσιμων πόρων και συναλλαγών",
    icon: Users,
    gradient: "from-purple-500 to-pink-500",
    hoverBorder: "hover:border-purple-400",
  },
  {
    type: "admin" as const,
    title: "Διαχειριστής",
    description: "Διαχείριση Χρηστών και Ρόλων",
    icon: Shield,
    gradient: "from-orange-500 to-red-500",
    hoverBorder: "hover:border-orange-400",
  },
];

interface UserSelectionProps {
  onSelectUser: (type: UserType) => void;
  onLogin: (loggedIn: boolean) => void;
}

export function UserSelection({ onSelectUser, onLogin }: UserSelectionProps) {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const activeTypeConfig = USER_TYPES_CONFIG.find(
    (u) => u.type === selectedType
  );

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showForgotModal) {
        setShowForgotModal(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showForgotModal]);

  const handleTypeSelect = (type: UserType) => {
    // Citizens bypass login
    if (type === "citizen") {
      onSelectUser("citizen");
      onLogin(true);
    } else {
      setSelectedType(type);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    // Validation
    if (!username.trim() || !password.trim()) {
      setError("Παρακαλώ συμπληρώστε όλα τα πεδία");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await authenticateUser(username, password, selectedType);

      // Simulate API delay (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Success
      onSelectUser(selectedType);
      onLogin(true);
    } catch (err) {
      setError("Λάθος όνομα χρήστη ή κωδικός");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedType(null);
    setError("");
    setUsername("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />

      <div className="w-full max-w-6xl z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
            Efficiencity
          </h1>
          <p className="text-xl text-slate-400 font-light tracking-wide">
            Σύστημα Διαχείρισης Πόρων
          </p>
        </div>

        {!selectedType ? (
          /* User Type Selection */
          <div className="grid md:grid-cols-3 gap-6">
            {USER_TYPES_CONFIG.map((userType) => {
              const Icon = userType.icon;
              return (
                <button
                  key={userType.type}
                  onClick={() => handleTypeSelect(userType.type)}
                  className={`group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.07] hover:shadow-2xl text-left ${userType.hoverBorder}`}
                  aria-label={`Είσοδος ως ${userType.title}`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${userType.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {userType.title}
                  </h3>

                  <p className="text-slate-400 mb-8 min-h-[3rem] text-sm leading-relaxed">
                    {userType.description}
                  </p>

                  <div className="flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                    <span className="mr-2">
                      {userType.type === "citizen"
                        ? "Άμεση Είσοδος"
                        : `Σύνδεση ως ${userType.title.split(" ")[0]}`}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Login Form */
          <div className="max-w-md mx-auto">
            <button
              onClick={handleBack}
              className="group text-slate-400 hover:text-white mb-8 flex items-center transition-colors text-sm font-medium"
              aria-label="Επιστροφή"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Επιστροφή στην επιλογή
            </button>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${activeTypeConfig?.gradient}`}
              />

              <div className="flex flex-col items-center mb-8">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeTypeConfig?.gradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  {activeTypeConfig && (
                    <activeTypeConfig.icon className="w-8 h-8 text-white" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {activeTypeConfig?.title}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Εισάγετε τα στοιχεία σας για να συνεχίσετε
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-xs font-medium text-slate-300 uppercase tracking-wider ml-1"
                  >
                    Όνομα Χρήστη
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                    placeholder="user@example.com"
                    autoFocus
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-slate-300 uppercase tracking-wider ml-1"
                  >
                    Κωδικός Πρόσβασης
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all pr-12"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      aria-label={
                        showPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-slate-400 hover:text-blue-300 transition-colors"
                    >
                      Ξεχάσατε τον κωδικό;
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${activeTypeConfig?.gradient} text-white font-semibold hover:shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Σύνδεση...</span>
                    </>
                  ) : (
                    <span>Είσοδος στο Σύστημα</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
        >
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowForgotModal(false)}
            aria-hidden="true"
          />

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
              aria-label="Κλείσιμο"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="text-blue-400 w-6 h-6" />
              </div>

              <h3
                id="forgot-password-title"
                className="text-xl font-bold text-white mb-2"
              >
                Ανάκτηση Κωδικού
              </h3>

              <p className="text-slate-400 text-sm mb-6">
                Για λόγους ασφαλείας, η επαναφορά κωδικού γίνεται μόνο μέσω του
                τμήματος IT.
              </p>

              <div className="bg-white/5 rounded-lg p-4 w-full mb-6 border border-white/5">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                  Email Υποστήριξης
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-blue-300 font-mono hover:text-blue-200 transition-colors"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>

              <button
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Εντάξει, κατάλαβα
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
