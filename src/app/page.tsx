import Link from 'next/link';
import {
  Home as HomeIcon,
  Syringe,
  Pill,
  FlaskRound as Flask,
  Phone,
  ChevronRight,
  Clock,
  Truck,
  FileText,
  BadgeCheck
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="glass-card p-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Your Health Is Our{' '}
                  <span className="text-blue-600">Top Priority</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Providing comprehensive healthcare services with modern facilities and experienced medical
                  professionals in Lalitpur, Nepal.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/services" className="glass-button flex items-center justify-center">
                    Book Appointment
                  </Link>
                  <Link href="/lab-tests" className="glass-button flex items-center justify-center">
                    Book Lab Test
                  </Link>
                  <Link href="/epharmacy" className="glass-button flex items-center justify-center">
                    Purchase Medicines
                  </Link>
                  <a href="tel:015202097" className="glass-button-secondary flex items-center justify-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="glass-card p-2">
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80"
                  alt="Doctor consulting with patient"
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="glass-card inline-block p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience healthcare at your doorstep with our premium home services.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Doctor Home Visit */}
            <div className="glass-card p-8">
              <div className="w-12 h-12 bg-blue-100/50 backdrop-blur rounded-lg flex items-center justify-center mb-4">
                <HomeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Doctor Home Visit</h3>
              <p className="text-gray-600 mb-4">
                Get expert medical consultation in the comfort of your home.
              </p>
              <Link href="/services" className="text-blue-600 hover:text-blue-700 flex items-center">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Lab Tests */}
            <div className="glass-card p-8">
              <div className="w-12 h-12 bg-green-100/50 backdrop-blur rounded-lg flex items-center justify-center mb-4">
                <Flask className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lab Tests</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive laboratory testing with accurate results.
              </p>
              <Link href="/lab-tests" className="text-blue-600 hover:text-blue-700 flex items-center">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* ePharmacy */}
            <div className="glass-card p-8">
              <div className="w-12 h-12 bg-purple-100/50 backdrop-blur rounded-lg flex items-center justify-center mb-4">
                <Pill className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ePharmacy</h3>
              <p className="text-gray-600 mb-4">
                Order medicines online and get them delivered to your doorstep.
              </p>
              <Link href="/epharmacy" className="text-blue-600 hover:text-blue-700 flex items-center">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Link href="/services" className="glass-button-secondary">
                Book Appointment
              </Link>
              <Link href="/lab-tests" className="glass-button-secondary">
                Book Lab Test
              </Link>
              <Link href="/epharmacy" className="glass-button-secondary">
                Order Medicine
              </Link>
              <Link href="/contact" className="glass-button-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
