import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // If they came from the Cart's checkout button, we want to send them back to shipping after signing up!
  const redirect = location.search ? location.search.split("=")[1] : "/";

  // If the user is already logged in, they shouldn't be on the register page
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Check if passwords match before bothering the backend
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      // Send the data to your Express backend
      const { data } = await axios.post(
        "https://ecommerce-backend-0cza.onrender.com/api/users",
        { name, email, password },
        config,
      );

      // Instantly log them in by saving the backend's response to Local Storage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Redirect them (either to the homepage, or to shipping if they were checking out)
      navigate(redirect);
      window.location.reload(); // Refresh to update the Navbar with their name!
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration",
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "60px auto",
        fontFamily: "sans-serif",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h2
        style={{ textAlign: "center", marginBottom: "20px", fontSize: "28px" }}
      >
        Sign Up
      </h2>

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
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
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              fontSize: "16px",
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
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter email"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              fontSize: "16px",
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
            placeholder="Enter password"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              fontSize: "16px",
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
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm password"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#222",
            color: "white",
            padding: "15px",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Register
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
        Have an account?{" "}
        <Link
          to={redirect ? `/login?redirect=${redirect}` : "/login"}
          style={{
            color: "#3498db",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
