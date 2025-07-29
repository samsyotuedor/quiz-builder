"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, Target, Clock, ArrowRight, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Contestant {
  id: string
  name: string
  score: number
  color: string
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points: number
}

export default function GameShowPlayPage() {
  const router = useRouter()
  const [gameConfig, setGameConfig] = useState<any>(null)
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [currentContestantIndex, setCurrentContestantIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([])
  const [selectedQuestionNumber, setSelectedQuestionNumber] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gamePhase, setGamePhase] = useState<"selecting" | "answering" | "result" | "finished">("selecting")
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(false)

  useEffect(() => {
    const config = localStorage.getItem("gameShowConfig")
    if (config) {
      const parsedConfig = JSON.parse(config)
      setGameConfig(parsedConfig)
      setContestants(parsedConfig.contestants)
      setCurrentContestantIndex(parsedConfig.currentContestantIndex || 0)
      setAnsweredQuestions(parsedConfig.answeredQuestions || [])
    } else {
      router.push("/gameshow")
    }
  }, [router])

  // Timer effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && timerActive) {
      handleTimeUp()
    }
  }, [timerActive, timeLeft])

  const handleTimeUp = () => {
    setTimerActive(false)
    if (gamePhase === "answering") {
      // Time's up, wrong answer
      handleAnswerSubmit(selectedAnswer, true)
    }
  }

  const selectQuestion = () => {
    const questionNum = Number.parseInt(selectedQuestionNumber)
    if (questionNum && questionNum >= 1 && questionNum <= gameConfig.questions.length) {
      const questionIndex = questionNum - 1
      const questionId = gameConfig.questions[questionIndex].id

      if (!answeredQuestions.includes(questionId)) {
        setCurrentQuestion(gameConfig.questions[questionIndex])
        setGamePhase("answering")
        setSelectedAnswer(null)
        setTimeLeft(30)
        setTimerActive(true)
      }
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (gamePhase === "answering") {
      setSelectedAnswer(answerIndex)
    }
  }

  const handleAnswerSubmit = (answerIndex: number | null, timeUp = false) => {
    if (!currentQuestion) return

    setTimerActive(false)
    const isCorrect = answerIndex === currentQuestion.correctAnswer
    setShowResult(true)
    setGamePhase("result")

    if (isCorrect && !timeUp) {
      // Correct answer - add points and continue turn
      const updatedContestants = [...contestants]
      updatedContestants[currentContestantIndex].score += currentQuestion.points
      setContestants(updatedContestants)
    } else {
      // Wrong answer or time up - pass turn to next contestant
      setCurrentContestantIndex((currentContestantIndex + 1) % contestants.length)
    }

    // Mark question as answered
    setAnsweredQuestions([...answeredQuestions, currentQuestion.id])

    // Check if game is finished
    if (answeredQuestions.length + 1 >= gameConfig.questions.length) {
      setTimeout(() => setGamePhase("finished"), 3000)
    }
  }

  const nextTurn = () => {
    setShowResult(false)
    setCurrentQuestion(null)
    setSelectedQuestionNumber("")
    setGamePhase("selecting")
    setSelectedAnswer(null)
  }

  const getAvailableQuestions = () => {
    return gameConfig?.questions.filter((q: Question) => !answeredQuestions.includes(q.id)) || []
  }

  const getCurrentContestant = () => {
    return contestants[currentContestantIndex]
  }

  if (!gameConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b55d4] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    )
  }

  if (gamePhase === "finished") {
    const sortedContestants = [...contestants].sort((a, b) => b.score - a.score)
    const winner = sortedContestants[0]

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center">
              <h1 className="text-2xl font-bold text-gray-900">Game Show Results</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl">🎉 Game Complete! 🎉</CardTitle>
                <div className="text-2xl font-bold text-[#0b55d4] mt-4">Winner: {winner.name}</div>
                <div className="text-xl text-gray-600">Final Score: {winner.score} points</div>
              </CardHeader>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Final Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedContestants.map((contestant, index) => (
                    <div key={contestant.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                        <div
                          className={`w-10 h-10 ${contestant.color} rounded-full flex items-center justify-center text-white font-bold`}
                        >
                          {contestant.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{contestant.name}</div>
                          {index === 0 && <Badge className="bg-yellow-500">Winner</Badge>}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-[#0b55d4]">{contestant.score} pts</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-x-4">
              <Link href="/gameshow">
                <Button className="bg-[#0b55d4] hover:bg-[#0a4bc2]">Play Again</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const availableQuestions = getAvailableQuestions()
  const currentContestant = getCurrentContestant()
  const progress = (answeredQuestions.length / gameConfig.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">{gameConfig.title}</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Questions: {answeredQuestions.length}/{gameConfig.questions.length}
              </div>
              {timerActive && (
                <div className="flex items-center space-x-2 text-red-600">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono font-bold">{timeLeft}s</span>
                </div>
              )}
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Contestants Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4" />
                    Contestants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contestants.map((contestant, index) => (
                      <div
                        key={contestant.id}
                        className={`p-3 rounded-lg border ${
                          index === currentContestantIndex ? "border-[#0b55d4] bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-6 h-6 ${contestant.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                          >
                            {contestant.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{contestant.name}</div>
                            <div className="text-xs text-gray-500">{contestant.score} pts</div>
                          </div>
                          {index === currentContestantIndex && <Target className="h-4 w-4 text-[#0b55d4]" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Game Area */}
            <div className="lg:col-span-3">
              {gamePhase === "selecting" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div
                        className={`w-8 h-8 ${currentContestant.color} rounded-full flex items-center justify-center text-white font-bold mr-3`}
                      >
                        {currentContestant.name.charAt(0)}
                      </div>
                      {currentContestant.name}'s Turn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-6">
                      <p className="text-lg text-gray-600">
                        Choose a question number from 1 to {gameConfig.questions.length}
                      </p>

                      <div className="flex justify-center space-x-4">
                        <Input
                          type="number"
                          min="1"
                          max={gameConfig.questions.length}
                          value={selectedQuestionNumber}
                          onChange={(e) => setSelectedQuestionNumber(e.target.value)}
                          placeholder="Enter question number..."
                          className="w-48 text-center text-lg"
                        />
                        <Button
                          onClick={selectQuestion}
                          disabled={!selectedQuestionNumber || answeredQuestions.includes(`q${selectedQuestionNumber}`)}
                          className="bg-[#0b55d4] hover:bg-[#0a4bc2]"
                        >
                          Select Question
                        </Button>
                      </div>

                      <div className="text-sm text-gray-500">
                        Available questions: {availableQuestions.length} remaining
                      </div>

                      {/* Quick Select Grid */}
                      <div className="mt-8">
                        <h3 className="font-semibold mb-4">Quick Select:</h3>
                        <div className="grid grid-cols-10 gap-2">
                          {Array.from({ length: gameConfig.questions.length }, (_, i) => {
                            const questionNum = i + 1
                            const questionId = `q${questionNum}`
                            const isAnswered = answeredQuestions.includes(questionId)

                            return (
                              <Button
                                key={questionNum}
                                variant={isAnswered ? "secondary" : "outline"}
                                size="sm"
                                disabled={isAnswered}
                                onClick={() => setSelectedQuestionNumber(questionNum.toString())}
                                className={`h-10 w-10 p-0 ${
                                  selectedQuestionNumber === questionNum.toString()
                                    ? "bg-[#0b55d4] text-white"
                                    : isAnswered
                                      ? "bg-gray-200 text-gray-400"
                                      : ""
                                }`}
                              >
                                {questionNum}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {gamePhase === "answering" && currentQuestion && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Question {gameConfig.questions.indexOf(currentQuestion) + 1}</span>
                      <Badge className="bg-[#0b55d4]">{currentQuestion.points} points</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg mb-6">{currentQuestion.question}</p>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full text-left justify-start p-4 h-auto ${
                            selectedAnswer === index ? "bg-[#0b55d4] text-white border-[#0b55d4]" : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                          <span>{option}</span>
                        </Button>
                      ))}
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={() => handleAnswerSubmit(selectedAnswer)}
                        disabled={selectedAnswer === null}
                        className="bg-green-600 hover:bg-green-700 px-8"
                      >
                        Submit Answer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {gamePhase === "result" && currentQuestion && showResult && (
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center space-x-2">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <>
                          <CheckCircle className="h-8 w-8 text-green-600" />
                          <span className="text-green-600">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-8 w-8 text-red-600" />
                          <span className="text-red-600">Incorrect</span>
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <p className="text-lg">{currentQuestion.question}</p>

                      <div className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                              index === currentQuestion.correctAnswer
                                ? "bg-green-100 border-green-300 text-green-800"
                                : index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer
                                  ? "bg-red-100 border-red-300 text-red-800"
                                  : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                            <span>{option}</span>
                            {index === currentQuestion.correctAnswer && <span className="ml-2 text-green-600">✓</span>}
                          </div>
                        ))}
                      </div>

                      {currentQuestion.explanation && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {currentQuestion.explanation}
                          </p>
                        </div>
                      )}

                      <Button onClick={nextTurn} className="bg-[#0b55d4] hover:bg-[#0a4bc2]">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Continue Game
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
