"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Trophy, Gamepad2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function ContestantWaitingPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [contestantData, setContestantData] = useState<any>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [contestants, setContestants] = useState<any[]>([]);

  useEffect(() => {
    // Load contestant session
    const savedContestant = localStorage.getItem("contestantSession");
    if (savedContestant) {
      setContestantData(JSON.parse(savedContestant));
    }

    // Load session info
    const savedSessions = localStorage.getItem("gameSessions");
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      const session = sessions.find((s: any) => s.id === sessionId);
      if (session) {
        setSessionInfo(session);
        setContestants(session.contestants || []);
      }
    }

    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      const savedSessions = localStorage.getItem("gameSessions");
      if (savedSessions) {
        const sessions = JSON.parse(savedSessions);
        const session = sessions.find((s: any) => s.id === sessionId);
        if (session) {
          setSessionInfo(session);
          setContestants(session.contestants || []);

          // Check if game has started
          if (session.status === "active") {
            window.location.href = `/contestant/play/${sessionId}`;
          }
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId]);

  if (!contestantData || !sessionInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b55d4] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-[#0b55d4] rounded-lg flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {sessionInfo.title}
                </h1>
                <p className="text-sm text-gray-600">
                  Game Code: {sessionInfo.code}
                </p>
              </div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">
              Waiting to Start
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Message */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">
                Welcome, {contestantData.name}!
              </CardTitle>
              <p className="text-gray-600">
                You've successfully joined the quiz. Waiting for the host to
                start the game.
              </p>
            </CardHeader>
          </Card>

          {/* Game Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-[#0b55d4] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-[#0b55d4]">
                  {sessionInfo.questionCount}
                </div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-[#0b55d4] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-[#0b55d4]">
                  {contestants.length}
                </div>
                <div className="text-sm text-gray-600">Contestants</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-[#0b55d4] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-[#0b55d4]">
                  {contestantData.score}
                </div>
                <div className="text-sm text-gray-600">Your Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Contestants List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Contestants ({contestants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contestants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No contestants yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contestants.map((contestant, index) => (
                    <div
                      key={contestant.id}
                      className={`p-4 rounded-lg border ${
                        contestant.id === contestantData.id
                          ? "border-[#0b55d4] bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {contestant.name}
                            {contestant.id === contestantData.id && (
                              <span className="text-[#0b55d4] ml-2">(You)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Score: {contestant.score} pts
                          </div>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            contestant.connected
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                          title={contestant.connected ? "Online" : "Offline"}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Waiting Animation */}
          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <div className="animate-bounce">⏳</div>
              <span>Waiting for host to start the game...</span>
              <div className="animate-bounce">⏳</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
