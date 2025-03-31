import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/ui/property-card";
import { Property } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PropertySection = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  const filteredProperties = properties?.filter(property => {
    if (activeTab === "all") return true;
    return property.propertyType === activeTab;
  });

  return (
    <section className="py-16 bg-[#F8F8F8]" id="properties">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our hand-picked selection of premium land properties for your next investment.
          </p>
        </div>

        {/* Property filter options */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-4 justify-center">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              All Properties
            </TabsTrigger>
            <TabsTrigger value="Residential" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Residential Plots
            </TabsTrigger>
            <TabsTrigger value="Agricultural" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Agricultural Land
            </TabsTrigger>
            <TabsTrigger value="Commercial" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Commercial Plots
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Property listings */}
        {isLoading ? (
          <div className="text-center py-10">Loading properties...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error loading properties</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties && filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                No properties found. Please try another filter.
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/properties">
            <Button className="inline-block bg-primary text-white py-3 px-8 rounded-md hover:bg-opacity-90 transition">
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertySection;
