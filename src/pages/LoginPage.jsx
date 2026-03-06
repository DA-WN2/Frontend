import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Smart Redirect: If they came from the cart checkout, remember that path!
  const redirect = location.search ? location.search.split("=")[1] : "/";

  // If already logged in, push them to the redirect path
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(
        "https://ecommerce-backend-0cza.onrender.com/api/auth/signin",
        {
          email,
          password,
        },
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      // Go to the redirect path instead of hardcoded '/'
      navigate(redirect);
      window.location.reload(); // Refresh so the Navbar shows their name
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Invalid email or password",
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Sign In</h1>

      {error && (
        <div
          style={{
            backgroundColor: "#ffcccc",
            color: "#cc0000",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={submitHandler}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#2ecc71",
            color: "white",
            padding: "12px",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Sign In
        </button>
      </form>

      {/* --- ADDED REGISTRATION TOGGLE --- */}
      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
        New Customer?{" "}
        <Link
          to={redirect !== "/" ? `/register?redirect=${redirect}` : "/register"}
          style={{
            color: "#3498db",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Register Here
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
