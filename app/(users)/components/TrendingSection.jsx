// components/TrendingSection.jsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';

const TrendingSection = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/images/trending');
        const data = await res.json();
        setImages(data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch trending images', err);
      }
    };

    fetchTrending();
  }, []);

  if (!images.length) return null;

  return (
    <section className="mx-5 px-4 py-10">
      <h2 className="text-lg md:text-2xl underline font-semibold mb-6">Trending Images</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Large left image */}
        <div className="lg:col-span-1">
          {images[0] && (
            <Link href={`/products/${images[0].categorySlug || images[0].category?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "")}/${images[0].slug}`}>
              <div className="relative h-full rounded-lg overflow-hidden shadow-lg group cursor-pointer">
                <img
                  src={images[0].thumbnailUrl || images[0].imageUrl}
                  alt={images[0].title}
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <h3 className="text-lg font-semibold">{images[0].title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <FaHeart className="text-red-500" />
                    {images[0].likes}
                  </div>
                </div> */}
              </div>
            </Link>
          )}
        </div>

        {/* Four stacked images on the right */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {images.slice(1).map((image) => (
            <Link key={image._id} href={`/products/${image.categorySlug || image.category?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "")}/${image.slug}`}>
              <div className="group relative h-[240px] rounded-lg overflow-hidden shadow-lg cursor-pointer">
                <img
                  src={image.thumbnailUrl || image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                  <h3 className="text-md font-medium truncate">{image.title}</h3>
                  <div className="text-sm text-gray-200 flex items-center gap-1 mt-1">
                    <FaHeart className="text-red-500" /> {image.likes}
                  </div>
                </div> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
