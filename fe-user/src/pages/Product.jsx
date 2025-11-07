import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCartPlus, FaFilter, FaCubes, FaSortAlphaDown } from "react-icons/fa";
import api from "../services/api";
import { useCart } from "../contexts/CartContext";
import AOS from "aos";
import "aos/dist/aos.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState("Tất cả");
  const [sortOrder, setSortOrder] = useState("Mặc định");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();
  const { updateCartCount } = useCart();
  const itemsPerPage = 9;
  const apiUrl = import.meta.env.VITE_API_URL;

  const getImageUrl = (url) => {
    if (!url) return "/no-image.png";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads")) return `${apiUrl}${url}`;
    return `${apiUrl}/uploads/${url.replace("/uploads/", "")}`;
  };

  // 🔹 Fetch sản phẩm từ backend với filter category
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `/products?page=${currentPage}&limit=${itemsPerPage}`;
      if (category !== "Tất cả") url += `&category=${encodeURIComponent(category)}`;

      const res = await api.get(url);
      setProducts(res.data.products);
      setFiltered(res.data.products); // initialize filtered
      setTotalPages(Math.ceil(res.data.totalProducts / itemsPerPage));
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Gọi fetchProducts khi currentPage hoặc category thay đổi
  useEffect(() => {
    AOS.init({ duration: 400, easing: "ease-out-cubic", once: true });
    fetchProducts();
  }, [currentPage, category]);

  // 🔹 Lọc priceRange và sortOrder ở frontend
  useEffect(() => {
    let filteredData = [...products];

    // Price range filter
    if (priceRange !== "Tất cả") {
      if (priceRange === "<500k") filteredData = filteredData.filter((p) => p.price < 500000);
      else if (priceRange === "500k-1tr")
        filteredData = filteredData.filter((p) => p.price >= 500000 && p.price <= 1000000);
      else if (priceRange === ">1tr") filteredData = filteredData.filter((p) => p.price > 1000000);
    }

    // Sort
    if (sortOrder === "A-Z") {
      filteredData.sort((a, b) => a.name.localeCompare(b.name, "vi", { sensitivity: "base" }));
    } else if (sortOrder === "Z-A") {
      filteredData.sort((a, b) => b.name.localeCompare(a.name, "vi", { sensitivity: "base" }));
    }

    setFiltered(filteredData);
  }, [products, priceRange, sortOrder]);

  const showNotification = (text, type) => {
    setMessage({ text, type });
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    try {
      await api.post("/cart/add", { productId: product._id, quantity: 1 });
      updateCartCount();
      showNotification("🧱 Đã thêm sản phẩm vào giỏ hàng!", "success");
    } catch {
      showNotification("Không thể thêm sản phẩm!", "error");
    }
  };

  const handleClick = (product) => navigate(`/product/${product._id}`, { state: product });

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-[#6b3f24]">
        Đang tải sản phẩm...
      </div>
    );

  return (
    <div className="bg-[#fdf8f0] min-h-screen px-6 py-10 font-sans">
      {showMessage && (
        <div
          className={`fixed top-20 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Filter */}
      <div
        className="bg-yellow-200 rounded-xl shadow-md p-4 flex flex-wrap justify-center gap-4 mb-10"
        data-aos="fade-up"
      >
        <div className="flex items-center gap-2">
          <FaCubes className="text-[#e11d48]" />
          <span className="font-bold text-[#6b3f24]">Danh mục:</span>
          <select
            className="p-2 rounded-lg border border-yellow-400"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>Tất cả</option>
            <option>Lego Architecture</option>
            <option>Lego City</option>
            <option>Lego Friends</option>
            <option>Lego Technic</option>
            <option>Lego Ninjago</option>
            <option>Lego DC Super Heroes</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FaFilter className="text-[#e11d48]" />
          <span className="font-bold text-[#6b3f24]">Giá:</span>
          <select
            className="p-2 rounded-lg border border-yellow-400"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option>Tất cả</option>
            <option>&lt;500k</option>
            <option>500k-1tr</option>
            <option>&gt;1tr</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FaSortAlphaDown className="text-[#e11d48]" />
          <span className="font-bold text-[#6b3f24]">Sắp xếp:</span>
          <select
            className="p-2 rounded-lg border border-yellow-400"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option>Mặc định</option>
            <option>A-Z</option>
            <option>Z-A</option>
          </select>
        </div>
      </div>

      {/* Product list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filtered.map((product, i) => (
          <div
            key={product._id}
            onClick={() => handleClick(product)}
            className="bg-white rounded-2xl shadow-lg hover:shadow-[0_6px_0_#e11d48] hover:-translate-y-2 transition-all p-4 cursor-pointer border-2 border-yellow-400"
            data-aos="zoom-in"
            data-aos-delay={i * 50}
          >
            <div className="w-full h-56 bg-yellow-50 flex items-center justify-center rounded-xl overflow-hidden">
              <img
                src={getImageUrl(product.imageUrl?.[0])}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                onError={(e) => (e.target.src = "/no-image.png")}
              />
            </div>
            <h2 className="text-lg font-bold text-[#6b3f24] mt-3 mb-2 truncate">{product.name}</h2>
            <p className="text-[#e11d48] font-bold mb-3">{product.price.toLocaleString()}đ</p>
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className="w-full py-2 rounded-lg bg-[#e11d48] text-white font-bold hover:bg-[#c00] transition"
            >
              <FaCartPlus className="inline mr-2" /> Thêm vào giỏ
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10" data-aos="fade-up">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 rounded-full border text-sm flex items-center justify-center ${
              currentPage === i + 1 ? "bg-[#6b3f24] text-white" : "bg-white text-[#6b3f24]"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Product;
