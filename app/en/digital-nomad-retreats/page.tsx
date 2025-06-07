import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  ArrowRight,
  Users,
  Laptop,
  TreesIcon as Tree,
  Waves,
  Calendar,
  Target,
  Brain,
  Heart,
  Coffee,
  Mountain,
  Star,
  Clock,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Digital Nomad Retreats Argentina - Focused Remote Work Programs | Il Buco",
  description: "Join curated digital nomad retreats in Argentina. Structured programs combining remote work, skill development, wellness, and community in Carilo's pristine natural setting.",
  keywords: "digital nomad retreats, remote work retreat argentina, nomad retreat program, digital nomad argentina, structured remote work, wellness retreat",
  openGraph: {
    title: "Digital Nomad Retreats Argentina - Structured Remote Work Programs",
    description: "Experience transformative digital nomad retreats in Argentina. Structured programs designed for productivity, personal growth, and meaningful connections.",
    url: "https://ilbuco.com/en/digital-nomad-retreats",
    siteName: "Il Buco Coliving",
    images: [
      {
        url: "/modern-bedroom-pine-view.png",
        width: 1200,
        height: 630,
        alt: "Digital nomad retreat workspace with pine forest views in Argentina",
      },
    ],
    locale: "en_US",
  },
}

export default function DigitalNomadRetreatsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-50 to-blue-100">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Digital Nomad
                  <span className="text-purple-600"> Retreats</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Transform your remote work experience with our curated digital nomad retreats 
                  in Argentina. Structured programs combining productivity, personal growth, 
                  wellness, and meaningful connections in Carilo's inspiring natural environment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/en/book"
                    className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Join Next Retreat <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/en/location"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors"
                  >
                    View Location
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/modern-bedroom-pine-view.png"
                  alt="Digital nomad retreat workspace with nature views"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Our Retreats Special */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Structured Programs for Digital Nomads
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Unlike casual coworking spaces, our digital nomad retreats provide 
                structured programming designed to maximize productivity, learning, 
                and personal development.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Goal-Oriented Framework
                </h3>
                <p className="text-gray-700">
                  Structured approach to help you achieve specific professional 
                  and personal goals during your retreat experience.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Skill Development Workshops
                </h3>
                <p className="text-gray-700">
                  Weekly masterclasses and workshops led by industry experts 
                  and successful retreat alumni.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Wellness Integration
                </h3>
                <p className="text-gray-700">
                  Daily wellness practices including meditation, yoga, and 
                  forest bathing to maintain work-life balance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Retreat Programs */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Curated Retreat Programs
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose from our specialized retreat programs, each designed for 
                different goals and experience levels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/person-pine-window.png"
                    alt="Productivity-focused digital nomad retreat"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Productivity Intensive (2 Weeks)
                </h3>
                <p className="text-gray-600 mb-6">
                  Designed for remote workers looking to level up their productivity 
                  and establish sustainable work habits while connecting with nature.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Deep work sessions with Pomodoro techniques</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Time management and focus workshops</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-700">Accountability partnerships</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Tree className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Daily nature breaks and forest walks</span>
                  </div>
                </div>
                <Link
                  href="/en/book"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Join Productivity Retreat
                </Link>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/gallery/hero-deck-terrace.jpeg"
                    alt="Entrepreneurship-focused digital nomad retreat"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Entrepreneur Accelerator (4 Weeks)
                </h3>
                <p className="text-gray-600 mb-6">
                  Intensive program for aspiring entrepreneurs and side-hustlers 
                  looking to launch or scale their business ventures.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-700">Business plan development sessions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Mentor matching and feedback sessions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Laptop className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Product development workshops</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span className="text-gray-700">Pitch practice and investor readiness</span>
                  </div>
                </div>
                <Link
                  href="/en/book"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Join Entrepreneur Retreat
                </Link>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/modern-living-room-pine-forest.png"
                    alt="Leadership digital nomad retreat program"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Leadership Development (3 Weeks)
                </h3>
                <p className="text-gray-600 mb-6">
                  For remote team leaders and managers looking to enhance their 
                  leadership skills and build high-performing distributed teams.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Remote team management strategies</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-700">Emotional intelligence workshops</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Goal setting and team alignment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Coffee className="h-5 w-5 text-yellow-600" />
                    <span className="text-gray-700">Peer leadership circles and feedback</span>
                  </div>
                </div>
                <Link
                  href="/en/book"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Join Leadership Retreat
                </Link>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/carilo-beach-forest.png"
                    alt="Wellness-focused digital nomad retreat"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Digital Wellness Reset (2 Weeks)
                </h3>
                <p className="text-gray-600 mb-6">
                  Perfect for burned-out remote workers seeking to restore balance, 
                  establish healthy boundaries, and prevent digital overwhelm.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span className="text-gray-700">Burnout recovery and prevention</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Tree className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Digital detox and nature immersion</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Boundary setting workshops</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Waves className="h-5 w-5 text-cyan-600" />
                    <span className="text-gray-700">Mindfulness and stress reduction</span>
                  </div>
                </div>
                <Link
                  href="/en/book"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Join Wellness Retreat
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Schedule */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Typical Retreat Day Schedule
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Our structured daily schedule balances focused work time, 
                    learning opportunities, wellness activities, and community connection.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-600 font-semibold">7:00</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Morning Wellness</h3>
                      <p className="text-gray-600 text-sm">
                        Optional meditation, yoga, or beach walk to start the day mindfully
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold">9:00</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Deep Work Session</h3>
                      <p className="text-gray-600 text-sm">
                        Focused work time in private workspaces with productivity techniques
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold">12:00</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Community Lunch</h3>
                      <p className="text-gray-600 text-sm">
                        Shared meals with fellow retreat participants and networking
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-semibold">14:00</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Workshop/Collaboration</h3>
                      <p className="text-gray-600 text-sm">
                        Skills workshops, masterclasses, or collaborative project time
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-semibold">18:00</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Community Time</h3>
                      <p className="text-gray-600 text-sm">
                        Beach activities, group dinners, or reflection circles
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/gallery/hero-outdoor-seating.jpeg"
                  alt="Digital nomad retreat community gathering"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Retreat Benefits */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Digital Nomad Retreats?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the benefits of structured programming combined with 
                Argentina's natural beauty and affordable lifestyle.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Goal Achievement
                </h3>
                <p className="text-gray-600 text-sm">
                  93% of participants achieve their stated goals by retreat completion
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Lasting Network
                </h3>
                <p className="text-gray-600 text-sm">
                  Build professional relationships that continue long after the retreat
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Skill Development
                </h3>
                <p className="text-gray-600 text-sm">
                  Learn from industry experts and successful digital nomads
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Work-Life Balance
                </h3>
                <p className="text-gray-600 text-sm">
                  Establish sustainable habits for long-term remote work success
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Retreats */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Upcoming Retreat Dates
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Limited spots available. Early bird discounts for advance bookings.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-blue-50 border-2 border-blue-200 p-8 rounded-xl">
                <div className="flex items-center space-x-4 mb-6">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">March 15-29</h3>
                    <p className="text-gray-600">Productivity Intensive</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Spring season retreat focusing on productivity systems and goal achievement.
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <p>• 8 spots remaining</p>
                  <p>• Early bird: $1,200 (reg $1,500)</p>
                  <p>• Includes accommodation & meals</p>
                </div>
                <Link
                  href="/en/book"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reserve Spot
                </Link>
              </div>
              
              <div className="bg-purple-50 border-2 border-purple-200 p-8 rounded-xl">
                <div className="flex items-center space-x-4 mb-6">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">April 5 - May 3</h3>
                    <p className="text-gray-600">Entrepreneur Accelerator</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Intensive business development program with mentor matching.
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <p>• 5 spots remaining</p>
                  <p>• Early bird: $2,800 (reg $3,500)</p>
                  <p>• Includes mentorship & materials</p>
                </div>
                <Link
                  href="/en/book"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Apply Now
                </Link>
              </div>
              
              <div className="bg-green-50 border-2 border-green-200 p-8 rounded-xl">
                <div className="flex items-center space-x-4 mb-6">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">May 20 - June 10</h3>
                    <p className="text-gray-600">Leadership Development</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Advanced program for remote team leaders and managers.
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <p>• 12 spots available</p>
                  <p>• Early bird: $2,000 (reg $2,500)</p>
                  <p>• Executive coaching included</p>
                </div>
                <Link
                  href="/en/book"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Join Waitlist
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-purple-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Remote Work Experience?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join hundreds of digital nomads who have accelerated their careers, 
              built lasting relationships, and achieved their goals through our retreat programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/en/book"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Apply for Next Retreat <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/en/rooms"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
              >
                View Accommodations
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}