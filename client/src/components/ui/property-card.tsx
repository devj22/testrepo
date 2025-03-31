import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { 
    id, 
    title, 
    price, 
    location, 
    size, 
    sizeUnit, 
    features, 
    images, 
    isFeatured,
    propertyType 
  } = property;

  // Format price in Indian currency format (e.g., ₹1.2 Cr for 12000000)
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lac`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };

  return (
    <Card className="property-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={images[0]} 
          alt={title} 
          className="w-full h-56 object-cover"
        />
        {isFeatured && (
          <span className="absolute top-4 left-4 bg-[#FF6B35] text-white text-sm font-medium px-3 py-1 rounded-md">
            Featured
          </span>
        )}
        {propertyType === "Agricultural" && (
          <span className="absolute top-4 left-4 bg-[#A67C52] text-white text-sm font-medium px-3 py-1 rounded-md">
            Agricultural
          </span>
        )}
        {propertyType === "Commercial" && (
          <span className="absolute top-4 left-4 bg-[#333333] text-white text-sm font-medium px-3 py-1 rounded-md">
            Commercial
          </span>
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <span className="text-primary font-bold">{formatPrice(price)}</span>
        </div>
        
        <p className="text-gray-500 mb-4">
          <i className="fas fa-map-marker-alt mr-2"></i>{location}
        </p>
        
        <div className="flex justify-between text-sm text-gray-600 mb-6">
          <span>
            <i className="fas fa-ruler-combined mr-1"></i> {size} {sizeUnit}
          </span>
          {features && features.length > 0 && (
            <>
              <span>
                <i className="fas fa-road mr-1"></i> {features[0]}
              </span>
              {features.length > 1 && (
                <span>
                  <i className="fas fa-leaf mr-1"></i> {features[1]}
                </span>
              )}
            </>
          )}
        </div>
        
        <Link href={`/properties/${id}`}>
          <a className="block text-center bg-white text-primary border border-primary py-2 rounded-md hover:bg-primary hover:text-white transition">
            View Details
          </a>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
