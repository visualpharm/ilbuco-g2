import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Code,
  Calculator,
  CuboidIcon as Cube,
  Briefcase,
  Rocket,
  Waves,
  TreePine,
  UtensilsCrossed,
  Bike,
  Dumbbell,
  BookOpen,
  PenTool,
} from "lucide-react"

export default function ThingsToDo() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">Things to Do</h1>
              <p className="text-lg text-gray-700 mb-12">
                IL BUCO is designed to be the perfect environment for both productivity and relaxation. Whether you're
                looking to make progress on work projects, learn new skills, or simply unwind in a beautiful natural
                setting, our villa offers the ideal backdrop for your goals.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold mb-8">Achieve Your Goals</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-16">
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-start mb-3">
                    <Code className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                    <div>
                      <h3 className="text-lg font-semibold">Dive into JavaScript Frameworks</h3>
                      <p className="text-gray-600">
                        With our high-speed internet and comfortable workspaces, IL BUCO is the perfect place to focus
                        on learning new programming skills or building your next web application.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-start mb-3">
                    <Calculator className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                    <div>
                      <h3 className="text-lg font-semibold">Master Financial Accounting</h3>
                      <p className="text-gray-600">
                        Take advantage of the quiet environment to focus on learning financial accounting principles or
                        completing online courses like{" "}
                        <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                          this one
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-start mb-3">
                    <Cube className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                    <div>
                      <h3 className="text-lg font-semibold">Learn 3D Modeling</h3>
                      <p className="text-gray-600">
                        Explore tools like{" "}
                        <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                          Plasticity
                        </Link>{" "}
                        (it's like Figma for 3D) and bring your design ideas to life in our inspiring setting.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-start mb-3">
                    <Briefcase className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                    <div>
                      <h3 className="text-lg font-semibold">Boost Your Remote-Work Career</h3>
                      <p className="text-gray-600">
                        Use your time at IL BUCO to refine your remote work skills, update your portfolio, or network
                        with other professionals staying at the villa.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-start mb-3">
                    <Rocket className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                    <div>
                      <h3 className="text-lg font-semibold">Launch Your Startup</h3>
                      <p className="text-gray-600">
                        The peaceful environment and minimal distractions make IL BUCO an ideal place to focus on
                        developing your business plan, building your MVP, or preparing for your launch.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-start mb-3">
                    <BookOpen className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                    <div>
                      <h3 className="text-lg font-semibold">Write Your Book or Blog</h3>
                      <p className="text-gray-600">
                        Many guests find that the tranquil setting of IL BUCO, surrounded by pine trees, provides the
                        perfect inspiration for writing projects.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-8">Explore and Relax</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-16">
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-start mb-3">
                    <Waves className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                    <div>
                      <h3 className="text-lg font-semibold">Beach Activities</h3>
                      <p className="text-gray-600">
                        Cariló's beautiful beaches are just a short walk away. Enjoy swimming, sunbathing, beach
                        volleyball, or simply relaxing by the ocean.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-start mb-3">
                    <TreePine className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                    <div>
                      <h3 className="text-lg font-semibold">Forest Walks</h3>
                      <p className="text-gray-600">
                        Explore the unique pine forests of Cariló through numerous walking trails. The peaceful
                        environment is perfect for meditation and mindfulness practices.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-start mb-3">
                    <Bike className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                    <div>
                      <h3 className="text-lg font-semibold">Cycling</h3>
                      <p className="text-gray-600">
                        Rent bicycles and explore Cariló and the surrounding areas. The town's unpaved streets and
                        natural setting make for a pleasant cycling experience.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-start mb-3">
                    <UtensilsCrossed className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                    <div>
                      <h3 className="text-lg font-semibold">Culinary Experiences</h3>
                      <p className="text-gray-600">
                        Enjoy cooking in our fully equipped kitchen, have a BBQ on the terrace, or explore the local
                        restaurants offering Argentine and international cuisine.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-start mb-3">
                    <Dumbbell className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                    <div>
                      <h3 className="text-lg font-semibold">Fitness and Wellness</h3>
                      <p className="text-gray-600">
                        Maintain your fitness routine with outdoor activities, yoga on the terrace, or visit local
                        wellness centers for spa treatments.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-start mb-3">
                    <PenTool className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                    <div>
                      <h3 className="text-lg font-semibold">Creative Projects</h3>
                      <p className="text-gray-600">
                        The natural light and inspiring views make IL BUCO perfect for photography, drawing, painting,
                        or other creative pursuits.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-12">
                <Image
                  src="/placeholder.svg?height=400&width=800&query=person working on laptop with view of pine trees"
                  alt="Working at IL BUCO"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Book Your Stay</h3>
                <p className="text-gray-700 mb-4">
                  Ready to achieve your goals while enjoying the beautiful surroundings of Cariló? Contact us to check
                  availability and book your stay at IL BUCO.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
