"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, Trophy, Clock, Eye, EyeOff } from "lucide-react";
import { useParams } from "next/navigation";

export default function PresentationPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [contestants, setContestants] = useState<any[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      loadSessionData();

      // Poll for updates every 2 seconds
      const interval = setInterval(loadSessionData, 2000);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  const loadSessionData = () => {
    try {
      // Load sessions from localStorage
      const savedSessions = localStorage.getItem("gameSessions");
      if (savedSessions) {
        const sessions = JSON.parse(savedSessions);
        const session = sessions.find((s: any) => s.id === sessionId);
        if (session) {
          setSession(session);
          setContestants(session.contestants || []);

          // Load quiz data
          const savedQuiz = localStorage.getItem("currentQuiz");
          if (savedQuiz) {
            const quizData = JSON.parse(savedQuiz);
            setQuiz(quizData);

            // Load current question
            if (session.current_question_index >= 0 && quizData.questions) {
              const question =
                quizData.questions[session.current_question_index];
              if (question) {
                setCurrentQuestion({
                  question: question.question,
                  options: question.options,
                  correct_answer: question.correctAnswer,
                  explanation: question.explanation,
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading session data:", error);
    }
  };

  if (!session || !quiz) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading presentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#0b55d4] rounded-lg flex items-center justify-center">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{quiz.title}</h1>
                <p className="text-blue-200">Game Code: {session.code}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {contestants.length}
                </div>
                <div className="text-sm text-gray-300">Contestants</div>
              </div>
              <Badge
                className={`text-lg px-4 py-2 ${
                  session.status === "active"
                    ? "bg-green-600"
                    : session.status === "waiting"
                    ? "bg-yellow-600"
                    : "bg-gray-600"
                }`}
              >
                {session.status.charAt(0).toUpperCase() +
                  session.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {session.status === "waiting" && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Clock className="h-12 w-12 text-yellow-400" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Waiting for Game to Start
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Contestants are joining...
            </p>

            {/* Live Contestant Counter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-400">
                  {contestants.length}
                </div>
                <div className="text-gray-300">Total Joined</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-green-400">
                  {contestants.filter((c) => c.connected).length}
                </div>
                <div className="text-gray-300">Online Now</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-400">
                  {session.code}
                </div>
                <div className="text-gray-300">Game Code</div>
              </div>
            </div>
          </div>
        )}

        {session.status === "active" && currentQuestion && (
          <div className="max-w-6xl mx-auto">
            {/* Question Display */}
            <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-lg text-blue-300 mb-2">
                    Question {session.current_question_index + 1}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    {currentQuestion.question}
                  </h2>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  {currentQuestion.options.map(
                    (option: string, index: number) => (
                      <div
                        key={index}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                          showAnswers &&
                          index === currentQuestion.correct_answer
                            ? "bg-green-500/30 border-green-400 text-green-100"
                            : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                              showAnswers &&
                              index === currentQuestion.correct_answer
                                ? "bg-green-500 text-white"
                                : "bg-[#0b55d4] text-white"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-xl font-medium">{option}</span>
                          {showAnswers &&
                            index === currentQuestion.correct_answer && (
                              <div className="ml-auto">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold">
                                    ✓
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Show/Hide Answers Button */}
                <div className="text-center mt-8">
                  <Button
                    onClick={() => setShowAnswers(!showAnswers)}
                    className={`px-8 py-3 text-lg ${
                      showAnswers
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {showAnswers ? (
                      <>
                        <EyeOff className="mr-2 h-5 w-5" />
                        Hide Answer
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-5 w-5" />
                        Show Answer
                      </>
                    )}
                  </Button>
                </div>

                {/* Explanation */}
                {showAnswers && currentQuestion.explanation && (
                  <div className="mt-8 p-6 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                    <h3 className="text-xl font-bold text-blue-200 mb-2">
                      Explanation:
                    </h3>
                    <p className="text-lg text-blue-100">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live Leaderboard */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center">
                    <Trophy className="mr-2 h-6 w-6 text-yellow-400" />
                    Live Leaderboard
                  </h3>
                  <div className="text-sm text-gray-300">
                    {contestants.filter((c) => c.connected).length} online
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contestants.slice(0, 9).map((contestant, index) => (
                    <div
                      key={contestant.id}
                      className={`p-4 rounded-lg border ${
                        index === 0
                          ? "bg-yellow-500/20 border-yellow-400"
                          : index === 1
                          ? "bg-gray-400/20 border-gray-400"
                          : index === 2
                          ? "bg-orange-500/20 border-orange-400"
                          : "bg-white/10 border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0
                                ? "bg-yellow-500 text-black"
                                : index === 1
                                ? "bg-gray-400 text-black"
                                : index === 2
                                ? "bg-orange-500 text-black"
                                : "bg-[#0b55d4] text-white"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{contestant.name}</div>
                            <div className="text-sm text-gray-300">
                              {contestant.connected ? "Online" : "Offline"}
                            </div>
                          </div>
                        </div>
                        <div className="text-xl font-bold">
                          {contestant.score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {session.status === "finished" && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Trophy className="h-12 w-12 text-green-400" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Game Complete!</h2>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for participating
            </p>

            {/* Final Leaderboard */}
            {contestants.length > 0 && (
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-6">Final Results</h3>
                <div className="space-y-4">
                  {contestants.slice(0, 5).map((contestant, index) => (
                    <div
                      key={contestant.id}
                      className={`p-6 rounded-lg border ${
                        index === 0
                          ? "bg-yellow-500/20 border-yellow-400"
                          : "bg-white/10 border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                              index === 0
                                ? "bg-yellow-500 text-black"
                                : "bg-[#0b55d4] text-white"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span className="text-xl font-medium">
                            {contestant.name}
                          </span>
                          {index === 0 && (
                            <span className="text-yellow-400">👑</span>
                          )}
                        </div>
                        <span className="text-2xl font-bold">
                          {contestant.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
