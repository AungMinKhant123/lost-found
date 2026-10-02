import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// A simple image carousel: only renders nav arrows/dots when there's
// more than one image, and shows exactly as many dots as images exist
// (so 3 uploaded photos = 3 dots, never a fixed count). Falls back to
// the plain "Image Placeholder" box when there are zero images — same
// look used everywhere else in the app for missing photos.
const ImageCarousel = ({ images = [] }) => {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-48 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm mt-4">
        Image Placeholder
      </div>
    );
  }

  const goPrev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full h-65 rounded-lg bg-neutral-100 overflow-hidden mt-4 group">
      <img
        src={images[index]}
        alt={`Photo ${index + 1} of ${images.length}`}
        className="w-full h-full object-cover"
      />

      {images.length > 1 && (
        <>
          {/* Lightly visible arrows — fully visible on hover, soft otherwise */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-text-primary opacity-70 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-text-primary opacity-70 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={18} />
          </button>

          {/* Pagination dots — one per image, current one highlighted */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === index ? "bg-primary" : "bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
