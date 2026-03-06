import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  // State for all the product fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `https://ecommerce-backend-0cza.onrender.com/api/products/${productId}`,
        );
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // --- MOVE THIS INSIDE THE COMPONENT ---
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        "https://ecommerce-backend-0cza.onrender.com/api/upload",
        formData,
        config,
      );

      setImage(data.image); // Now it has access to setImage!
      alert("Image uploaded successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `https://ecommerce-backend-0cza.onrender.com/api/products/${productId}`,
        { name, price, image, brand, category, countInStock, description },
        config,
      );

      alert("Product updated successfully!");
      navigate("/admin/productlist");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <Link
        to="/admin/productlist"
        style={{
          textDecoration: "none",
          color: "#333",
          fontWeight: "bold",
          display: "inline-block",
          marginBottom: "20px",
        }}
      >
        &larr; Go Back
      </Link>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "20px", fontSize: "28px" }}>
          Edit Product
        </h2>

        {loading ? (
          <p>Loading product details...</p>
        ) : error ? (
          <div
            style={{
              padding: "15px",
              backgroundColor: "#ffcccc",
              color: "#cc0000",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        ) : (
          <form
            onSubmit={submitHandler}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {/* Name Input */}
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
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Price and Stock */}
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Price ($)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Count In Stock
                </label>
                <input
                  type="number"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
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
            </div>

            {/* Image Upload Block */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Choose Image File
              </label>
              <input
                type="file"
                onChange={uploadFileHandler}
                style={{ marginBottom: "10px" }}
              />
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Or enter image URL"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Brand and Category */}
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Brand
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
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
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
            </div>

            {/* Description */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                  fontFamily: "sans-serif",
                }}
              ></textarea>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "#3498db",
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
              Update Product
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEditPage;
