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
        <div className="max-w-3xl mx-auto -mt-32 mb-20 bg-white rounded-lg shadow-xl p-8 z-20 relative">
          <h2 className="text-2xl font-semibold mb-6">Find Your Ideal Land</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
                <option>Any Location</option>
                <option>Bangalore</option>
                <option>Mysore</option>
                <option>Chennai</option>
                <option>Hyderabad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price Range</label>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
                <option>Any Price</option>
                <option>Under ₹50 Lacs</option>
                <option>₹50 Lacs - ₹1 Cr</option>
                <option>₹1 Cr - ₹2 Cr</option>
                <option>Above ₹2 Cr</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
                <option>Any Size</option>
                <option>Under 10 Guntha</option>
                <option>10-20 Guntha</option>
                <option>20-40 Guntha</option>
                <option>1-2 Acres</option>
                <option>Above 2 Acres</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <Button className="w-full md:w-auto float-right mt-2 bg-primary text-white py-3 px-8 rounded-md hover:bg-opacity-90 transition">
                Search Properties
              </Button>
            </div>
          </form>
        </div>

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
