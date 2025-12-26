import { useState } from "react";
import { AdminDashboard } from "./components/AdminDashboard";
import { CitizenDashboard } from "./components/CitizenDashboard";
import { EmployeeDashboard } from "./components/EmployeeDashboard";
import { UserSelection } from "./components/UserSelection";

export type UserType = "employee" | "citizen" | "admin" | null;

// Main application component

export default function App() {
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setUserType(null);
    setIsLoggedIn(false);
  };

  if (!userType || !isLoggedIn) {
    return <UserSelection onSelectUser={setUserType} onLogin={setIsLoggedIn} />;
  }

  return (
    <>
      {userType === "employee" && <EmployeeDashboard onLogout={handleLogout} />}
      {userType === "citizen" && <CitizenDashboard onLogout={handleLogout} />}
      {userType === "admin" && <AdminDashboard onLogout={handleLogout} />}
    </>
  );
}
