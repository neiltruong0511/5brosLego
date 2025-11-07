import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StarRatings from "react-star-ratings";
import api from "../../services/api";

//hiển thị danh sách sản phẩm nổi bật
const Services = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();
  
  // Thêm state apiUrl
  const [apiUrl] = useState(import.meta.env.VITE_API_URL);
  
  // Thêm hàm getImageUrl
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.includes('gojekapi.com')) return url;
    if (url.startsWith('/uploads')) return `${apiUrl}${url}`;
    return `${apiUrl}/uploads/${url.replace('/uploads/', '')}`;
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products/featured');
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <span id="services"></span>
      <div className="py-10">
        <div className="container">
          <div className="text-center mb-20 max-w-[400px] mx-auto">
            <h1 className="text-3xl mb-10 font-bold">Sản Phẩm Nổi Bật</h1>
            <p className="text-2x1 max-w-[400px] text-gray-400 mx-aoto">
              Những sản phẩm được yêu thích nhất.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-20 place-items-center ">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                data-aos="zoom-in"
                data-aos-duration="300"
                className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-primary dark:hover:bg-primary hover:text-white relative shadow-xl duration-high group max-w-[300px] cursor-pointer"
              >
                <div className="h-[200px] w-[250px]">
                  <img
                    src={getImageUrl(product.imageUrl[0])}
                    alt={product.name}
                    className="w-[250px] block mx-auto transform -translate-y-14
                    group-hover:scale-105 group-hover:rotate-6 duration-300 object-cover rounded-t-2xl"
                    onError={(e) => {
                      console.log("Lỗi tải hình:", e.target.src);
                      e.target.onerror = null;
                      e.target.src = '/no-image.png';
                    }}
                  />
                </div>
                <div className="p-4 text-center">
                  <div className="w-full">
                    <StarRatings
                      rating={5}
                      starRatedColor="yellow"
                      isSelectable={false}
                      starHoverColor="yellow"
                      starDimension="20px"
                      changeRating={() => { }}
                      numberOfStars={5}
                      name="rating"
                    />
                  </div>
                  <h1 className="text-l font-bold">{product.name.toUpperCase()}</h1>
                  <p className="text-gray-500 group-hover:text-white duration-high text-sm line-clamp-2">
                    Giá: {product.price.toLocaleString()}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;