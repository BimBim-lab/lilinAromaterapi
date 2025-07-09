import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { WorkshopPackage } from "@shared/schema";
const API = import.meta.env.VITE_API_BASE_URL;

export default function SchedulePricing() {
  const { data: apiPackages, isLoading } = useQuery({
    queryKey: ["/api/workshop-packages"],
    queryFn: async () => {
      const response = await fetch(`${API}/api/admin/workshop-packages`);
      if (!response.ok) throw new Error("Failed to fetch packages");
      return response.json();
    },
  });

  // Fallback data jika API belum tersedia
  const fallbackPackages = [
    {
      id: 1,
      name: "Workshop Basic",
      description: "Untuk pemula yang ingin belajar dasar",
      price: 350000,
      duration: "3 jam",
      features: JSON.stringify([
        "Membuat 2 lilin aromaterapi",
        "Materi & tools disediakan",
        "Sertifikat keikutsertaan"
      ]),
      isActive: true
    },
    {
      id: 2,
      name: "Workshop Premium", 
      description: "Untuk yang ingin belajar lebih mendalam",
      price: 650000,
      duration: "5 jam",
      features: JSON.stringify([
        "Membuat 4 lilin aromaterapi",
        "Teknik advanced blending",
        "Starter kit take home",
        "Konsultasi 1 bulan"
      ]),
      isActive: true
    },
    {
      id: 3,
      name: "Workshop Professional",
      description: "Untuk calon entrepreneur",
      price: 1200000,
      duration: "8 jam (2 hari)",
      features: JSON.stringify([
        "Membuat 6 lilin aromaterapi",
        "Business planning session",
        "Complete starter kit",
        "Mentoring 3 bulan"
      ]),
      isActive: true
    }
  ];

  const packages = apiPackages?.filter((pkg: WorkshopPackage) => pkg.isActive) || fallbackPackages;

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const parseFeatures = (features: string) => {
    try {
      return JSON.parse(features);
    } catch {
      return [];
    }
  };

  const getMostPopularPackage = () => {
    if (packages.length >= 2) return 1; // Index of middle package
    return 0;
  };

  const selectPackage = (packageName: string) => {
    alert(`Anda memilih paket ${packageName}. Silakan lanjutkan ke halaman kontak untuk mendaftar.`);
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
            Jadwal & Harga Workshop
          </h2>
          <p className="text-lg text-gray-600">
            Pilih waktu yang sesuai dengan jadwal Anda
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat paket workshop...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg: WorkshopPackage, index: number) => {
              const isPopular = index === getMostPopularPackage();
              const features = parseFeatures(pkg.features);
              
              return (
                <div 
                  key={pkg.id}
                  className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative ${
                    isPopular ? 'border-2 border-rose-gold' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-rose-gold text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Paling Populer
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-semibold text-charcoal mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="text-3xl font-bold text-rose-gold mb-2">{formatPrice(pkg.price)}</div>
                    <p className="text-sm text-gray-500">per orang</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Durasi {pkg.duration}</span>
                    </li>
                    {features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => selectPackage(pkg.name)}
                    className={`w-full py-3 font-semibold transition-all duration-300 rounded-full ${
                      isPopular 
                        ? 'bg-rose-gold text-white hover:bg-charcoal' 
                        : 'bg-soft-pink text-charcoal hover:bg-rose-gold hover:text-white'
                    }`}
                  >
                    Pilih Package
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
