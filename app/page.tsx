import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Play, FileText, Users, Clock, Target, Trophy } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#0b55d4] rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">QuizBuilder</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/create" className="text-gray-600 hover:text-[#0b55d4] transition-colors">
                Create Quiz
              </Link>
              <Link href="/quiz" className="text-gray-600 hover:text-[#0b55d4] transition-colors">
                Take Quiz
              </Link>
              <Link href="/gameshow" className="text-gray-600 hover:text-[#0b55d4] transition-colors">
                Game Show
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Build & Take Quizzes
            <span className="block text-[#0b55d4]">Effortlessly</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create interactive quizzes, upload questions from various formats, and take timed assessments with instant
            feedback. Now with game show mode for competitive fun!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="bg-[#0b55d4] hover:bg-[#0a4bc2] text-white px-8 py-3">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Quiz
              </Button>
            </Link>
            <Link href="/quiz">
              <Button
                size="lg"
                variant="outline"
                className="border-[#0b55d4] text-[#0b55d4] hover:bg-[#0b55d4] hover:text-white px-8 py-3"
              >
                <Play className="mr-2 h-5 w-5" />
                Take Quiz
              </Button>
            </Link>
            <Link href="/gameshow">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                <Trophy className="mr-2 h-5 w-5" />
                Game Show Mode
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Powerful Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#0b55d4] rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Smart Data Extraction</CardTitle>
                <CardDescription>
                  Automatically extract key information from invoices, contracts, forms, and any document type with
                  99.9% accuracy.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#0b55d4] rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Timed Quizzes</CardTitle>
                <CardDescription>
                  Set countdown timers for each quiz to create engaging, time-bound assessments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#0b55d4] rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Instant Feedback</CardTitle>
                <CardDescription>
                  Get immediate results with correct answers highlighted and detailed explanations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Game Show Mode</CardTitle>
                <CardDescription>
                  Competitive quiz format where contestants take turns selecting questions by number.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#0b55d4] rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Multi-Contestant Support</CardTitle>
                <CardDescription>
                  Support up to 8 contestants in game show mode with turn-based question selection.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#0b55d4] rounded-lg flex items-center justify-center mb-4">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Question Navigation</CardTitle>
                <CardDescription>
                  Jump to any question instantly with our intuitive question navigation system.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#0b55d4]">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Create your first quiz in minutes, take a practice quiz, or set up a competitive game show with friends!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="bg-white text-[#0b55d4] hover:bg-gray-100 px-8 py-3">
                Start Creating
              </Button>
            </Link>
            <Link href="/gameshow">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#0b55d4] px-8 py-3"
              >
                Try Game Show Mode
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">© 2024 QuizBuilder. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
