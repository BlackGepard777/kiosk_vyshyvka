import { Navigate } from "react-router";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  email?: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

async function getUserProfile(
  setUser: (u: User | null) => void,
  setLoading: (loading: boolean) => void
) {
  try {
    const res = await fetch("/api/user", {
      method: "GET",
      credentials: "include", // <-- обовʼязково для кукі
      headers: {
        // не обов’язково, але корисно вказати очікуваний формат
        "Accept": "application/json",
      },
    });

    if (res.ok) {
      const data = (await res.json()) as User;
      setUser(data);
    } else {
      setUser(null);
    }
  } catch (error) {
    console.error("Failed to fetch user profile", error);
    setUser(null);
  } finally {
    setLoading(false);
  }
}


export function AuthorizedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile(setUser, setLoading);
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  ) : <Navigate to="/admin/login" replace />;
}