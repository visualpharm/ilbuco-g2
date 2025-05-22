import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Mail, Phone, MapPin, Calendar, Users, Clock } from "lucide-react"

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">Contact Us</h1>
              <p className="text-lg text-gray-700 mb-12">
                Ready to book your stay at IL BUCO or have questions about our villa? We're here to help. Fill out the
                form below or use our contact information to get in touch with us.
              </p>

              <div className="grid md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone (optional)
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        ></textarea>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Mail className="h-6 w-6 mr-4 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Email</h3>
                        <p className="text-gray-700">info@ilbuco.com.ar</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="h-6 w-6 mr-4 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Phone</h3>
                        <p className="text-gray-700">+54 11 1234 5678</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 mr-4 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Address</h3>
                        <p className="text-gray-700">Cariló, Buenos Aires Province, Argentina</p>
                        <p className="text-gray-700">(Exact address will be provided upon booking confirmation)</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold mb-4">Booking Information</h3>

                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                          <div>
                            <p className="text-gray-700">
                              <span className="font-medium">Availability:</span> Year-round
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Users className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                          <div>
                            <p className="text-gray-700">
                              <span className="font-medium">Capacity:</span> Up to 8 guests (4 bedrooms)
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Clock className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                          <div>
                            <p className="text-gray-700">
                              <span className="font-medium">Minimum Stay:</span> 3 nights (longer stays preferred)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold">What is the check-in/check-out time?</h4>
                    <p className="text-gray-700">Check-in is at 3:00 PM and check-out is at 11:00 AM.</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Is there a security deposit?</h4>
                    <p className="text-gray-700">
                      Yes, we require a security deposit that will be refunded within 7 days after check-out, assuming
                      no damages.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Are pets allowed?</h4>
                    <p className="text-gray-700">
                      Unfortunately, we do not allow pets at IL BUCO to maintain the property's cleanliness and
                      accommodate guests with allergies.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Is there housekeeping service?</h4>
                    <p className="text-gray-700">
                      Yes, we provide weekly housekeeping for stays longer than 7 days. Additional cleaning services can
                      be arranged for an extra fee.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
