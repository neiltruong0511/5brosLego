import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AOS from "aos";
import "aos/dist/aos.css";

const DetailProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { updateCartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [apiUrl] = useState(import.meta.env.VITE_API_URL);
  
  // Khởi tạo AOS
  useEffect(() => {
    AOS.init({
      duration: 400,
      once: true,
    });
  }, []);
  
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.includes('gojekapi.com')) return url;
    if (url.startsWith('/uploads')) return `${apiUrl}${url}`;
    return `${apiUrl}/uploads/${url.replace('/uploads/', '')}`;
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);
  
  // Refresh AOS khi sản phẩm được tải xong
  useEffect(() => {
    if (!loading) {
      AOS.refresh();
    }
  }, [loading]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);

      // Lấy các sản phẩm liên quan
      const relatedResponse = await api.get(`/products?category=${response.data.category}`);
      
      // Đảm bảo không lấy lại sản phẩm hiện tại và xử lý URL hình ảnh
      const filteredProducts = relatedResponse.data.products
        .filter(p => p._id !== id)
        .map(p => ({
          ...p,
          id: p._id, // Thêm trường id để dùng trong component Link
          imageUrl: p.imageUrl && p.imageUrl.length > 0 ? p.imageUrl : ['/no-image.png']
        }));
        
      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!user) {
        navigate('/login', { state: { from: `/product/${id}` } });
        return;
      }

      const response = await api.post('/cart/add', {
        productId: id,
        quantity: quantity
      });

      if (response.data) {
        updateCartCount();
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  const handleNext = () => {
    setStartIndex((startIndex + 1) % relatedProducts.length);
    setTimeout(() => AOS.refresh(), 100); // Refresh AOS sau khi đổi sản phẩm
  };

  const handlePrev = () => {
    setStartIndex((startIndex - 1 + relatedProducts.length) % relatedProducts.length);
    setTimeout(() => AOS.refresh(), 100); // Refresh AOS sau khi đổi sản phẩm
  };

  const otherProducts = [];
  if (relatedProducts.length > 0) {
    let i = startIndex;
    while (otherProducts.length < 3) {
      otherProducts.push({ ...relatedProducts[i], id: relatedProducts[i]._id });
      i = (i + 1) % relatedProducts.length;
    }
  }

  if (loading) return <div className="text-center mt-20" data-aos="fade-in">Đang tải...</div>;

  if (!product) {
    return (
      <div className="text-center mt-20" data-aos="fade-in">
        <h2 className="text-2xl font-bold text-red-600">
          Sản phẩm không tồn tại!
        </h2>
        <Link to="/" className="text-blue-600 underline mt-4 inline-block">
          Quay về trang sản phẩm
        </Link>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-[#3d1f00] bg-white pt-10 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center" data-aos="fade-right">
          <img
            src={getImageUrl(product.imageUrl[0])}
            alt={product.name}
            className="w-full max-w-md h-auto object-cover rounded-2xl shadow-xl"
            onError={(e) => {
              console.log("Lỗi tải hình:", e.target.src);
              e.target.onerror = null;
              e.target.src = '/no-image.png';
            }}
          />
        </div>

        <div data-aos="fade-left" data-aos-delay="200">
          <h1 
            className="text-4xl font-bold mb-4 uppercase tracking-wide"
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            {product.name}
          </h1>
          <p 
            className="text-sm text-gray-700 mb-6 leading-relaxed"
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            {product.description ||
              "Thức uống đặc biệt, thơm ngon cho mọi lứa tuổi."}
          </p>

          <div 
            className="mb-4"
            data-aos="fade-up" 
            data-aos-delay="300"
          >
            <label className="block font-semibold mb-2">Số lượng:</label>
            <div className="w-36 h-12 rounded-full border border-gray-300 bg-white shadow-inner flex items-center justify-between px-2">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 bg-[#f0f0f0] hover:bg-[#e0f0f0] text-xl font-bold rounded-full flex items-center justify-center shadow-sm transition-all duration-150"
              >
                −
              </button>
              <span className="text-lg font-semibold w-10 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => Math.min(prev + 1, product.stock))}
                className="w-10 h-10 bg-[#f0f0f0] hover:bg-[#e0f0f0] text-xl font-bold rounded-full flex items-center justify-center shadow-sm transition-all duration-150"
              >
                +
              </button>
            </div>

            <span className="text-sm text-gray-500 ml-2">
              Còn {product.stock} sản phẩm
            </span>
          </div>

          <p 
            className="mt-4 text-lg font-semibold"
            data-aos="fade-up" 
            data-aos-delay="400"
          >
            Tổng giá: {totalPrice.toLocaleString()} VNĐ
          </p>

          <button
            className="mt-6 bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white px-6 py-3 rounded-xl text-lg font-bold hover:opacity-90 transition-shadow shadow-md hover:shadow-xl"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            data-aos="zoom-in" 
            data-aos-delay="500"
          >
            {product.stock === 0 ? 'HẾT HÀNG' : 'THÊM GIỎ HÀNG'}
          </button>

          {showMessage && (
            <div className="fixed top-20 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>Đã thêm vào giỏ hàng thành công!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-24 mb-12" data-aos="fade-up" data-aos-delay="300"> 
        <h2 className="text-2xl font-bold mb-8 text-center" data-aos="fade-down">
          Sản phẩm khác
        </h2>
        
        {relatedProducts.length > 0 ? (
          <div className="flex items-center gap-6">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white border-2 border-[#6b3f24] text-[#6b3f24] hover:bg-[#6b3f24] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
              data-aos="fade-right"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1">
              {otherProducts.map((item, index) => (
                <Link
                  to={`/product/${item.id}`}
                  key={item.id}
                  className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white"
                  data-aos="zoom-in"
                  data-aos-delay={200 + (index * 100)}
                >
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={getImageUrl(item.imageUrl[0])}
                      alt={item.name}
                      className="h-48 w-full object-cover transform hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.log("Lỗi tải hình:", e.target.src);
                        e.target.onerror = null;
                        e.target.src = '/no-image.png';
                      }}
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-base font-semibold truncate">{item.name.toUpperCase()}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.price.toLocaleString()} VNĐ</p>
                  </div>
                </Link>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white border-2 border-[#6b3f24] text-[#6b3f24] hover:bg-[#6b3f24] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
              data-aos="fade-left"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">Không có sản phẩm tương tự.</p>
        )}
      </div>
    </div>
  );
};

export default DetailProduct;