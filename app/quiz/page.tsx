"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, FileText, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function QuizSetupPage() {
  const router = useRouter()
  const [quizData, setQuizData] = useState<any>(null)
  const [questionCount, setQuestionCount] = useState("10")
  const [timeLimit, setTimeLimit] = useState("30")

  useEffect(() => {
    const savedQuiz = localStorage.getItem("currentQuiz")
    if (savedQuiz) {
      setQuizData(JSON.parse(savedQuiz))
    } else {
      // Sample quiz data for demo
      const sampleQuiz = {
        title: "Sample General Knowledge Quiz",
        questions: [
          {
            id: "1",
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: 2,
            explanation: "Paris is the capital and largest city of France.",
          },
          {
            id: "2",
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 1,
            explanation: "Mars is called the Red Planet due to its reddish appearance from iron oxide on its surface.",
          },
          {
            id: "3",
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 1,
            explanation: "2 + 2 equals 4, this is basic arithmetic.",
          },
          {
            id: "4",
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            correctAnswer: 2,
            explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519.",
          },
          {
            id: "5",
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
            correctAnswer: 3,
            explanation: "The Pacific Ocean is the largest ocean, covering about 46% of the world's water surface.",
          },
        ],
      }
      setQuizData(sampleQuiz)
      localStorage.setItem("currentQuiz", JSON.stringify(sampleQuiz))
    }
  }, [])

  const startQuiz = () => {
    if (quizData) {
      const quizConfig = {
        ...quizData,
        questionCount: Number.parseInt(questionCount),
        timeLimit: Number.parseInt(timeLimit),
        selectedQuestions: quizData.questions.slice(0, Number.parseInt(questionCount)),
      }
      localStorage.setItem("quizConfig", JSON.stringify(quizConfig))
      router.push("/quiz/take")
    }
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b55d4] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#0b55d4] rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">QuizBuilder</h1>
            </Link>
            <Link href="/create">
              <Button variant="outline" className="border-[#0b55d4] text-[#0b55d4] hover:bg-[#0b55d4] hover:text-white">
                Create New Quiz
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{quizData.title}</h2>
            <p className="text-gray-600">Configure your quiz settings and start when ready</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Quiz Settings
              </CardTitle>
              <CardDescription>Customize your quiz experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="question-count">Number of Questions</Label>
                <Select value={questionCount} onValueChange={setQuestionCount}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                    <SelectItem value="30">30 Questions</SelectItem>
                    <SelectItem value="40">40 Questions</SelectItem>
                    <SelectItem value={quizData.questions.length.toString()}>
                      All {quizData.questions.length} Questions
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">Available questions: {quizData.questions.length}</p>
              </div>

              <div>
                <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                <Select value={timeLimit} onValueChange={setTimeLimit}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Minutes</SelectItem>
                    <SelectItem value="2">2 Minutes</SelectItem>
                    <SelectItem value="3">3 Minutes</SelectItem>
                    <SelectItem value="5">5 Minutes</SelectItem>
                    <SelectItem value="10">10 Minutes</SelectItem>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="45">45 Minutes</SelectItem>
                    <SelectItem value="60">60 Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quiz Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#0b55d4]">{questionCount}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#0b55d4]">{timeLimit}</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#0b55d4]">4</div>
                  <div className="text-sm text-gray-600">Options</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#0b55d4]">✓</div>
                  <div className="text-sm text-gray-600">Instant Results</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={startQuiz} size="lg" className="bg-[#0b55d4] hover:bg-[#0a4bc2] px-8 py-3">
              <Play className="mr-2 h-5 w-5" />
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
