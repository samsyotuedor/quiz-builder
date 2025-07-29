"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Play, Plus, Trash2, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Contestant {
  id: string
  name: string
  score: number
  color: string
}

const CONTESTANT_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
]

export default function GameShowSetupPage() {
  const router = useRouter()
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [newContestantName, setNewContestantName] = useState("")
  const [quizData, setQuizData] = useState<any>(null)

  useEffect(() => {
    const savedQuiz = localStorage.getItem("currentQuiz")
    if (savedQuiz) {
      setQuizData(JSON.parse(savedQuiz))
    } else {
      // Sample quiz data for demo
      const sampleQuiz = {
        title: "Game Show Quiz - General Knowledge",
        questions: Array.from({ length: 20 }, (_, i) => ({
          id: `q${i + 1}`,
          question: `Sample Question ${i + 1}: What is the answer to this question?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: Math.floor(Math.random() * 4),
          explanation: `This is the explanation for question ${i + 1}.`,
          points: 100,
        })),
      }
      setQuizData(sampleQuiz)
      localStorage.setItem("currentQuiz", JSON.stringify(sampleQuiz))
    }
  }, [])

  const addContestant = () => {
    if (newContestantName.trim() && contestants.length < 8) {
      const newContestant: Contestant = {
        id: Date.now().toString(),
        name: newContestantName.trim(),
        score: 0,
        color: CONTESTANT_COLORS[contestants.length],
      }
      setContestants([...contestants, newContestant])
      setNewContestantName("")
    }
  }

  const removeContestant = (id: string) => {
    setContestants(contestants.filter((c) => c.id !== id))
  }

  const startGameShow = () => {
    if (contestants.length >= 2 && quizData) {
      const gameShowConfig = {
        ...quizData,
        contestants,
        currentContestantIndex: 0,
        answeredQuestions: [],
        gameMode: "gameshow",
      }
      localStorage.setItem("gameShowConfig", JSON.stringify(gameShowConfig))
      router.push("/gameshow/play")
    }
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
            <Link href="/quiz">
              <Button variant="outline" className="border-[#0b55d4] text-[#0b55d4] hover:bg-[#0b55d4] hover:text-white">
                Regular Quiz Mode
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Show Setup</h2>
            <p className="text-gray-600">
              Set up contestants for a competitive quiz game where players take turns choosing questions
            </p>
          </div>

          {/* Quiz Info */}
          {quizData && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Quiz Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#0b55d4]">{quizData.questions.length}</div>
                    <div className="text-sm text-gray-600">Total Questions</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#0b55d4]">100</div>
                    <div className="text-sm text-gray-600">Points per Question</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#0b55d4]">Turn-Based</div>
                    <div className="text-sm text-gray-600">Game Mode</div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900">{quizData.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Contestants will take turns selecting question numbers. Wrong answers pass the turn to the next
                    contestant.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Contestants */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Add Contestants
              </CardTitle>
              <CardDescription>Add 2-8 contestants to participate in the game show</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newContestantName}
                  onChange={(e) => setNewContestantName(e.target.value)}
                  placeholder="Enter contestant name..."
                  onKeyPress={(e) => e.key === "Enter" && addContestant()}
                  className="flex-1"
                />
                <Button
                  onClick={addContestant}
                  disabled={!newContestantName.trim() || contestants.length >= 8}
                  className="bg-[#0b55d4] hover:bg-[#0a4bc2]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
              <p className="text-sm text-gray-500">{contestants.length}/8 contestants added (minimum 2 required)</p>
            </CardContent>
          </Card>

          {/* Contestants List */}
          {contestants.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Contestants ({contestants.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contestants.map((contestant, index) => (
                    <div key={contestant.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 ${contestant.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold">{contestant.name}</div>
                          <div className="text-sm text-gray-500">Score: {contestant.score}</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeContestant(contestant.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game Rules */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Game Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Badge className="bg-[#0b55d4] text-white mt-0.5">1</Badge>
                  <p>Contestants take turns selecting question numbers (e.g., "Question 15")</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Badge className="bg-[#0b55d4] text-white mt-0.5">2</Badge>
                  <p>Correct answers earn 100 points and the contestant continues their turn</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Badge className="bg-[#0b55d4] text-white mt-0.5">3</Badge>
                  <p>Wrong answers pass the turn to the next contestant</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Badge className="bg-[#0b55d4] text-white mt-0.5">4</Badge>
                  <p>Answered questions are removed from the pool</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Badge className="bg-[#0b55d4] text-white mt-0.5">5</Badge>
                  <p>Game ends when all questions are answered or time runs out</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Game */}
          <div className="text-center">
            <Button
              onClick={startGameShow}
              size="lg"
              disabled={contestants.length < 2}
              className="bg-green-600 hover:bg-green-700 px-8 py-3"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Game Show
            </Button>
            {contestants.length < 2 && (
              <p className="text-sm text-red-600 mt-2">Add at least 2 contestants to start the game</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
