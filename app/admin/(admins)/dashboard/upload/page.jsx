"use client";
import { useEffect, useState } from "react";
import slugify from "slugify";

export default function UploadPage() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    tags: "",
    type: "free",
    thumbnail: null,
    image: null,
    isTrending: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const [categories, setCategories] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (files) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));

      if (name === "thumbnail") {
        setThumbnailPreview(URL.createObjectURL(file));
      } else if (name === "image") {
        setImagePreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
      }
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const finalSlug = form.slug || slugify(form.title, { lower: true, strict: true });
    const categorySlug = slugify(form.category, { lower: true, strict: true });

    formData.append("title", form.title);
    formData.append("slug", finalSlug);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("categorySlug", categorySlug);
    formData.append("tags", form.tags);
    formData.append("type", form.type);
    formData.append("isTrending", form.isTrending);
    formData.append("seoTitle", form.seoTitle);
    formData.append("seoDescription", form.seoDescription);
    formData.append("seoKeywords", form.seoKeywords);

    if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
    if (form.image) formData.append("image", form.image);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      const res = JSON.parse(xhr.responseText);
      if (xhr.status === 200 && res.success) {
        alert("Upload successful!");
        setForm({
          title: "",
          slug: "",
          description: "",
          category: "",
          tags: "",
          type: "free",
          thumbnail: null,
          image: null,
          isTrending: false,
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
        });
        setThumbnailPreview(null);
        setImagePreview(null);
        setUploadProgress(0);
      } else {
        alert(res.message || "Upload failed.");
        setUploadProgress(0);
      }
    };

    xhr.onerror = () => {
      alert("Something went wrong.");
      setUploadProgress(0);
    };

    xhr.send(formData);
  };

  const displaySlug = form.slug || slugify(form.title, { lower: true, strict: true });
  const categorySlug = slugify(form.category, { lower: true, strict: true });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Upload New Asset
      </h1>

      {form.title && form.category && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-1">Custom URL Preview</h2>
          <p className="text-gray-600 text-sm">
            URL:{" "}
            <span className="text-blue-700">
              https://vecteno.com/products/{categorySlug}/{displaySlug}
            </span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-row gap-10">
          {/* LEFT FORM */}
          <div className="flex-1 space-y-4">
            <input name="title" value={form.title} placeholder="Title" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
            <input name="slug" value={form.slug} placeholder="Custom Slug (optional)" onChange={handleChange} className="w-full p-3 border rounded-lg" />
            <textarea name="description" value={form.description} placeholder="Description" onChange={handleChange} required rows={4} className="w-full p-3 border rounded-lg resize-none" />

            <select name="category" value={form.category} onChange={handleChange} required className="w-full p-3 border rounded-lg">
              <option value="">Select Category</option>
              {categories.length > 0
                ? categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                : ["Templates", "CDR Files", "PSD Files", "Invitations", "Banner", "Social Media", "Thumbnails"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
            </select>

            <input name="tags" value={form.tags} placeholder="Tags (comma separated)" onChange={handleChange} required className="w-full p-3 border rounded-lg" />

            <select name="type" value={form.type} onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>

            <div className="flex items-center space-x-2">
              <input type="checkbox" name="isTrending" checked={form.isTrending} onChange={handleChange} className="h-5 w-5" />
              <label className="text-gray-700">Mark as Trending</label>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 space-y-6 bg-white p-6 border rounded-2xl shadow">
            <div>
              <label className="block font-medium mb-1">Thumbnail Image</label>
              <input type="file" name="thumbnail" accept="image/*" onChange={handleChange} required className="w-full border rounded-lg p-2" />
              {thumbnailPreview && <img src={thumbnailPreview} alt="Preview" className="mt-2 w-full max-h-60 object-contain border rounded-lg" />}
            </div>

            <div>
              <label className="block font-medium mb-1">Downloadable File (Image or ZIP)</label>
              <input type="file" name="image" accept="image/*,application/zip" onChange={handleChange} required className="w-full border rounded-lg p-2" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-full max-h-60 object-contain border rounded-lg" />}
            </div>
          </div>
        </div>

        {/* SEO SECTION */}
        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold text-yellow-600">SEO Settings</h2>
          <input name="seoTitle" value={form.seoTitle} placeholder="SEO Title" onChange={handleChange} className="w-full p-3 border rounded-lg" />
          <textarea name="seoDescription" value={form.seoDescription} placeholder="SEO Description" onChange={handleChange} rows={2} className="w-full p-3 border rounded-lg resize-none" />
          <input name="seoKeywords" value={form.seoKeywords} placeholder="SEO Keywords (comma separated)" onChange={handleChange} className="w-full p-3 border rounded-lg" />

          {/* Live Preview */}
          <div className="bg-white border border-gray-300 rounded-lg p-4 mt-4 shadow-sm">
            <p className="text-lg text-blue-800 font-semibold">{form.seoTitle || form.title || "SEO Title Preview"}</p>
            <p className="text-sm text-green-700">
              https://vecteno.com/products/{categorySlug}/{displaySlug}
            </p>
            <p className="text-gray-600 text-sm">{form.seoDescription || "Meta description..."}</p>
          </div>
        </div>

        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-lg h-4">
            <div className="bg-blue-500 h-full rounded-lg transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Upload
        </button>
      </form>
    </div>
  );
}
