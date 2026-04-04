import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  image_url?: string;
  parent_id?: string;
}

interface Grouping {
  id: string;
  name: string;
  image_url?: string;
  children: Category[];
}

interface Props {
  groupings: Grouping[];
  getImageUrl: (url?: string) => string;
}

export default function LandingCategorySection({
  groupings,
  getImageUrl,
}: Props) {
  const navigate = useNavigate();
  const filteredGroupings = groupings || [];

  return (
    <section className="relative w-full bg-white"> 
      {/* Container utama disamakan dengan section lain */}
      <div className="relative z-10 max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-0 py-6 sm:py-10">
        
        {/* HEADER - Sekarang sejajar lurus dengan judul section lain */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold font-cocogoose text-left text-gray-800">
            Kategori
          </h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-x-4 gap-y-8">
          {filteredGroupings.map((group) => (
            <div
              key={group.id}
              onClick={() =>
                navigate(`/product-grouping?grouping=${group.name}`)
              }
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className="
                  w-16 h-16
                  sm:w-20 sm:h-20
                  md:w-24 md:h-24
                  2xl:w-32 2xl:h-32 
                  rounded-xl
                  overflow-hidden
                  bg-white
                  border border-gray-200
                  transition-all duration-300
                  group-hover:shadow-md
                  group-hover:border-blue-200
                "
              >
                {group.image_url ? (
                  <img
                    src={getImageUrl(group.image_url)}
                    alt={group.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm font-semibold text-gray-500">
                    {group.name.charAt(0)}
                  </div>
                )}
              </div>

              <span className="mt-3 text-xs sm:text-sm 2xl:text-base text-center font-medium transition-colors group-hover:text-blue-600">
                {group.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}