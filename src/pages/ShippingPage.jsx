import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ShippingPage = () => {
  const navigate = useNavigate();

  // Load saved address from memory if it exists
  const savedAddress =
    JSON.parse(localStorage.getItem("shippingAddress")) || {};

  const [address, setAddress] = useState(savedAddress.address || "");
  const [city, setCity] = useState(savedAddress.city || "");
  const [postalCode, setPostalCode] = useState(savedAddress.postalCode || "");
  const [country, setCountry] = useState(savedAddress.country || "");

  const submitHandler = (e) => {
    e.preventDefault();

    // Save the shipping details to Local Storage
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({ address, city, postalCode, country }),
    );

    // Move to the final confirmation page
    navigate("/placeorder");
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        fontFamily: "sans-serif",
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{ fontSize: "28px", marginBottom: "20px", textAlign: "center" }}
      >
        Shipping Address
      </h2>

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
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="123 Main St"
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
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            placeholder="Kozhikode"
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
            Postal Code
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            placeholder="673001"
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
            Country
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            placeholder="India"
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
          Continue
        </button>
      </form>
    </div>
  );
};

export default ShippingPage;
