import "./Login.css"
import { signInWithGoogle } from "../firebase";
import { useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router";

async function handleLogin(navigate: NavigateFunction, setError: (error: string) => void) {
  try {
    setError("");
    const result = await signInWithGoogle();
    const token = await result.user.getIdToken(); // Firebase ID token
    // send token to backend
    const apiResult = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
               "Authorization": `Bearer ${token}`},
      body: JSON.stringify({ token }),
    });

    if (!apiResult.ok) {
      setError("У вас немає прав доступу до цієї сторінки.");
    } else {
      navigate("/admin", { replace: true });
    }

  } catch (err) {
    console.error("Login failed", err);
    setError("Не вдалось увійти");
  }
}


function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  return (
    <div className="login">
      {error && <div className="error">{error}</div>}
      <button onClick={() => handleLogin(navigate, setError)}>Sign in</button>
    </div>
  )
}

export default Login;