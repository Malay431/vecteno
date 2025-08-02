import connectToDatabase from "@/lib/db";
import ImageModel from "@/app/models/Image";
import Link from "next/link";
import { FaCrown, FaDownload, FaGift } from "react-icons/fa";
import DownloadSection from "../../DownloadSection";

// Generate slug from text
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

// ✅ Generate SEO metadata
export async function generateMetadata({ params }) {
  await connectToDatabase();
  const { slug, category } = params;
  const decodedCategory = decodeURIComponent(category);

  let img = await ImageModel.findOne({
    slug,
    categorySlug: decodedCategory,
  });

  if (!img) {
    img = await ImageModel.findOne({
      slug,
      category: new RegExp(`^${decodedCategory.replace(/-/g, " ")}$`, "i"),
    });
  }

  const title = img?.seoTitle || img?.title || "Vecteno - Image";
  const description =
    img?.seoDescription ||
    img?.description ||
    "Explore this high-quality graphic asset on Vecteno. Download images, PSDs, templates, and more.";

  const url = `https://vecteno.com/products/${decodedCategory}/${slug}`;
  const imagePreview = img?.thumbnailUrl || img?.imageUrl || "https://vecteno.com/default-image.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Vecteno",
      images: [
        {
          url: imagePreview,
          width: 800,
          height: 600,
          alt: img?.title || "Vecteno Image",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imagePreview],
    },
  };
}

// ✅ Page Component
export default async function ImageDetailPage({ params }) {
  await connectToDatabase();
  const { slug, category } = params;
  const decodedCategory = decodeURIComponent(category);

  let image = await ImageModel.findOne({
    slug,
    categorySlug: decodedCategory,
  });

  if (!image) {
    image = await ImageModel.findOne({
      slug,
      category: new RegExp(`^${decodedCategory.replace(/-/g, " ")}$`, "i"),
    });
  }

  if (!image) {
    return <div className="p-10 text-center">Image not found.</div>;
  }

  const relatedImages = await ImageModel.aggregate([
    {
      $match: {
        category: image.category,
        slug: { $ne: image.slug },
      },
    },
    {
      $sample: { size: 8 },
    },
  ]);

  const downloadUrl = image.imageUrl.replace("/upload/", "/upload/fl_attachment/");

  return (
    <div className="px-6 py-10 bg-[#f4f8fc] min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link> /
        <Link
          href={`/category/${image.categorySlug || generateSlug(image.category)}`}
          className="ml-1 text-blue-600 hover:underline"
        >
          {image.category}
        </Link> /
        <span className="ml-1">{image.title}</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 bg-blue-100 rounded-lg shadow p-6 justify-center">
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <div className="relative border border-gray-300 rounded">
            <img
              src={image.imageUrl || image.thumbnailUrl}
              alt={image.title}
              className="w-full h-full object-contain rounded"
            />
            <div className="absolute bottom-0 w-full bg-yellow-400 text-black p-2 flex justify-between items-center text-sm rounded-b">
              <span>🌐 vecteno.com</span>
            </div>
          </div>

          <div className="mt-4 text-gray-800">
            <p>
              Don't settle for dull visuals. Download our{" "}
              <strong>{image.title}</strong> and bring your event to life. Our{" "}
              <strong>{image.category}</strong> collection features vibrant and festive designs
              that will enhance your creativity and impress your audience.
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full lg:w-[400px] bg-gray-50 border border-gray-300 rounded p-4">
          <h1 className="text-xl font-semibold mb-2">{image.title}</h1>
          <p className="text-gray-700 mb-4">Description: {image.description}</p>
          <p className="text-sm text-gray-600 mb-2">
            This image is protected by copyright. For commercial use and license authorization,
            please Upgrade to Individual Premium plan
          </p>

          <div className="rounded p-4 mb-4">
            <DownloadSection image={image} />
          </div>

          <div className="text-sm space-y-2 text-gray-700">
            <p>• Copyright guaranteed</p>
            <p>• PRF license for Individual commercial use</p>
            <p>• No attribution or credit author</p>
            <p>• Unlimited downloads of premium assets</p>
            <p>• Online invoice</p>
          </div>
        </div>
      </div>

      {/* Related Section */}
      <div className="mt-16 md:ml-10 md:mr-10">
        <h2 className="text-2xl font-semibold mb-4 underline underline-offset-2">
          More in this series
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {relatedImages.map((img) => (
            <div
              key={img._id}
              className="bg-white border rounded shadow-md hover:shadow-2xl transition duration-300"
            >
              <Link href={`/products/${img.categorySlug || generateSlug(img.category)}/${img.slug}`}>
                <img
                  src={img.thumbnailUrl || img.imageUrl}
                  alt={img.title}
                  className="w-full h-40 object-cover p-2 rounded-t"
                />
                <div className="p-2">
                  <p className="text-medium font-semibold">{img.title}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded text-medium font-semibold text-white w-full text-center ${
                      img.type === "premium"
                        ? "bg-gradient-to-r from-yellow-300 to-yellow-500"
                        : "bg-gradient-to-r from-blue-500 to-blue-700"
                    }`}
                  >
                    {img.type === "premium" ? (
                      <span className="flex items-center justify-center gap-1">
                        <FaCrown />
                        Premium
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        <FaGift />
                        Free Download
                      </span>
                    )}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
