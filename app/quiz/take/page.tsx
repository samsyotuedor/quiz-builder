"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface Answer {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
}

export default function TakeQuizPage() {
  const router = useRouter()
  const [quizConfig, setQuizConfig] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  // start with -1 so the timer won’t trigger until quizConfig is ready
  const [timeLeft, setTimeLeft] = useState(-1)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const config = localStorage.getItem("quizConfig")
    if (config) {
      const parsedConfig = JSON.parse(config)
      setQuizConfig(parsedConfig)
      setTimeLeft(parsedConfig.timeLimit * 60) // start the countdown here
    } else {
      router.push("/quiz")
    }
  }, [router])

  // countdown – runs only after quizConfig is available
  useEffect(() => {
    if (!quizConfig) return
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (timeLeft === 0 && !quizCompleted) {
      completeQuiz()
    }
  }, [quizConfig, timeLeft, quizCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizCompleted) return

    const currentQuestion = quizConfig.selectedQuestions[currentQuestionIndex]
    const isCorrect = answerIndex === currentQuestion.correctAnswer

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
    }

    const updatedAnswers = answers.filter((a) => a.questionId !== currentQuestion.id)
    setAnswers([...updatedAnswers, newAnswer])
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < quizConfig.selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const completeQuiz = () => {
    if (!quizConfig) return // <-- safeguard
    setQuizCompleted(true)
    setShowResults(true)

    const results = {
      totalQuestions: quizConfig.selectedQuestions.length,
      correctAnswers: answers.filter((a) => a.isCorrect).length,
      answers,
      timeSpent: quizConfig.timeLimit * 60 - timeLeft,
      completedAt: new Date().toISOString(),
    }

    localStorage.setItem("quizResults", JSON.stringify(results))
  }

  const getCurrentAnswer = () => {
    const currentQuestion = quizConfig?.selectedQuestions[currentQuestionIndex]
    return answers.find((a) => a.questionId === currentQuestion?.id)
  }

  if (!quizConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b55d4] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (showResults) {
    const correctCount = answers.filter((a) => a.isCorrect).length
    const totalQuestions = quizConfig.selectedQuestions.length
    const percentage = Math.round((correctCount / totalQuestions) * 100)

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#0b55d4] rounded-lg flex items-center justify-center">
                <Flag className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
                <div className="text-6xl font-bold text-[#0b55d4] my-4">{percentage}%</div>
                <p className="text-xl text-gray-600">
                  You got {correctCount} out of {totalQuestions} questions correct
                </p>
              </CardHeader>
            </Card>

            <div className="space-y-6">
              {quizConfig.selectedQuestions.map((question: Question, index: number) => {
                const userAnswer = answers.find((a) => a.questionId === question.id)
                const isCorrect = userAnswer?.isCorrect || false
                const selectedIndex = userAnswer?.selectedAnswer ?? -1

                return (
                  <Card
                    key={question.id}
                    className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Question {index + 1}</span>
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${
                            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg mb-4">{question.question}</p>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg border ${
                              optIndex === question.correctAnswer
                                ? "bg-green-100 border-green-300 text-green-800"
                                : optIndex === selectedIndex && !isCorrect
                                  ? "bg-red-100 border-red-300 text-red-800"
                                  : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                              <span>{option}</span>
                              {optIndex === question.correctAnswer && (
                                <span className="ml-auto text-green-600">✓ Correct</span>
                              )}
                              {optIndex === selectedIndex && !isCorrect && (
                                <span className="ml-auto text-red-600">✗ Your answer</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="text-center mt-8 space-x-4">
              <Link href="/quiz">
                <Button className="bg-[#0b55d4] hover:bg-[#0a4bc2]">Take Another Quiz</Button>
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

  const currentQuestion = quizConfig.selectedQuestions[currentQuestionIndex]
  const currentAnswer = getCurrentAnswer()
  const progress = ((currentQuestionIndex + 1) / quizConfig.selectedQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">{quizConfig.title}</h1>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quizConfig.selectedQuestions.length}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-[#0b55d4]">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              <Button onClick={completeQuiz} variant="outline" size="sm">
                <Flag className="mr-2 h-4 w-4" />
                Finish
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Question Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-sm">Question Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                    {quizConfig.selectedQuestions.map((_: any, index: number) => {
                      const hasAnswer = answers.some((a) => a.questionId === quizConfig.selectedQuestions[index].id)
                      return (
                        <Button
                          key={index}
                          variant={index === currentQuestionIndex ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToQuestion(index)}
                          className={`h-10 w-10 p-0 ${
                            index === currentQuestionIndex
                              ? "bg-[#0b55d4] hover:bg-[#0a4bc2]"
                              : hasAnswer
                                ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                                : ""
                          }`}
                        >
                          {index + 1}
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Question Area */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Question {currentQuestionIndex + 1}</CardTitle>
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
                          currentAnswer?.selectedAnswer === index
                            ? "bg-[#0b55d4] text-white border-[#0b55d4] hover:bg-[#0a4bc2]"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                        <span>{option}</span>
                      </Button>
                    ))}
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>

                    {currentQuestionIndex === quizConfig.selectedQuestions.length - 1 ? (
                      <Button onClick={completeQuiz} className="bg-green-600 hover:bg-green-700">
                        <Flag className="mr-2 h-4 w-4" />
                        Finish Quiz
                      </Button>
                    ) : (
                      <Button onClick={nextQuestion} className="bg-[#0b55d4] hover:bg-[#0a4bc2]">
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
