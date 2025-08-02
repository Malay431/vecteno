import Link from "next/link";
import React from "react";

const Footer = () => {
  const resources = ["Products", "Categories", "Pricing", "Blogs"];

  const legal = [
    "Terms of Service",
    "Privacy Policy",
    "License Agreement",
    "Contact Us",
  ];
  return (
    <footer className="bg-black">
      <div className="flex flex-col md:flex-row text-white p-10 md:justify-between ">
        <div>
          <h1 className="text-6xl font-bold mb-10">Vecteno</h1>
          <p>Gudamalani, Barmer (Rajasthan)</p>
          <p>info@vecteno.com</p>
        </div>

        <div className="text-white md:mx-10 my-10">
          <ul>
            {resources.map((resource, index) => (
              <li key={index} className="text-sm font-semibold mb-2">
                <Link
                  href={`/${resource.toLowerCase()}`}
                  className="hover:underline"
                >
                  {resource}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-white md:mx-10 my-10">
          <ul>
            {legal.map((item, index) => (
              <li key={index} className="text-sm font-semibold mb-2">
                <a
                  href={`/${item.toLowerCase()}`}
                  className="hover:underline"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-white md:mx-10 my-10">
          <div className="flex flex-col  ">
            Subscribe to our newsletter for the latest updates and offers.
            <input placeholder="Enter your Email Address" className="border border-gray-400 my-2 p-1"/>
            <button className="border-2 border-gray-500 rounded-xl w-30 h-10 mt-2 bg-white text-black hover:bg-black hover:text-white cursor-pointer">Subscribe</button>
          </div>
        </div>
      </div>

      <div>
        <p className="font-light text-center text-gray-500 pb-2">
          Powered By – God of Graphics | Copyright © 2025 Vecteno. All rights
          reserved. | Developed by Saarthi Digital Media and Marketing
        </p>
      </div>
    </footer>
  );
};

export default Footer;
