"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Users,
  Play,
  Settings,
  Eye,
  Trash2,
  FileText,
  Monitor,
  Database,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [quizData, setQuizData] = useState<any>(null);
  const [newSessionTitle, setNewSessionTitle] = useState("");

  useEffect(() => {
    const savedQuiz = localStorage.getItem("currentQuiz");
    if (savedQuiz) {
      setQuizData(JSON.parse(savedQuiz));
    }

    const savedSessions = localStorage.getItem("gameSessions");
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createNewSession = () => {
    if (!quizData || !newSessionTitle.trim()) return;

    const newSession = {
      id: Date.now().toString(),
      code: generateGameCode(),
      title: newSessionTitle.trim(),
      status: "waiting",
      contestants: [],
      createdAt: new Date().toISOString(),
      questionCount: quizData.questions.length,
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem("gameSessions", JSON.stringify(updatedSessions));
    setNewSessionTitle("");
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    const updatedSessions = sessions.filter(
      (session) => session.id !== sessionId
    );
    setSessions(updatedSessions);
    localStorage.setItem("gameSessions", JSON.stringify(updatedSessions));
  };

  const startSession = async (sessionId: string) => {
    const updatedSessions = sessions.map((session) =>
      session.id === sessionId ? { ...session, status: "active" } : session
    );
    setSessions(updatedSessions);
    localStorage.setItem("gameSessions", JSON.stringify(updatedSessions));
    router.push(`/admin/control/${sessionId}`);
  };

  const copyJoinLink = (code: string) => {
    const joinUrl = `${window.location.origin}/join/${code}`;
    navigator.clipboard.writeText(joinUrl);
    alert("Join link copied to clipboard!");
  };

  const copyPresentationLink = (sessionId: string) => {
    const presentationUrl = `${window.location.origin}/presentation/${sessionId}`;
    navigator.clipboard.writeText(presentationUrl);
    alert("Presentation link copied to clipboard!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "finished":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">
                QuizBuilder Admin
              </h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/create">
                <Button
                  variant="outline"
                  className="border-[#0b55d4] text-[#0b55d4] bg-transparent"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Create Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Game Session Management
          </h2>

          {/* Create New Session */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Create New Game Session
              </CardTitle>
              <CardDescription>
                Create a new quiz session with presentation mode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizData ? (
                  <div>
                    <h3 className="text-lg font-semibold">
                      Current Quiz: {quizData.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {quizData.questions.length} Questions
                    </p>
                  </div>
                ) : (
                  <p>No quiz loaded. Create or load a quiz first.</p>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Session Name
                  </label>
                  <Input
                    value={newSessionTitle}
                    onChange={(e) => setNewSessionTitle(e.target.value)}
                    placeholder="Enter session name..."
                  />
                </div>

                <Button
                  onClick={createNewSession}
                  disabled={!quizData || !newSessionTitle.trim()}
                  className="bg-[#0b55d4] hover:bg-[#0a4bc2]"
                >
                  Create Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Game Sessions ({sessions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No game sessions created yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {session.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>
                              Code:{" "}
                              <strong className="text-[#0b55d4]">
                                {session.code}
                              </strong>
                            </span>
                            <Badge className={getStatusColor(session.status)}>
                              {session.status.charAt(0).toUpperCase() +
                                session.status.slice(1)}
                            </Badge>
                            <span>
                              {session.contestants?.length || 0} contestants
                            </span>
                            <span>Questions: {session.questionCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyPresentationLink(session.id)}
                            className="border-purple-300 text-purple-600 hover:bg-purple-50"
                          >
                            <Monitor className="mr-2 h-4 w-4" />
                            Presentation
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyJoinLink(session.code)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Link
                          </Button>
                          {session.status === "waiting" && (
                            <Button
                              size="sm"
                              onClick={() => startSession(session.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Start
                            </Button>
                          )}
                          {session.status === "active" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                router.push(`/admin/control/${session.id}`)
                              }
                              className="bg-[#0b55d4] hover:bg-[#0a4bc2]"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Control
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSession(session.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Join Instructions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800 mb-2">
                          <strong>For Contestants:</strong>
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <strong>Join URL:</strong>
                            <code className="block bg-white p-1 rounded text-xs mt-1">
                              {window.location.origin}/join/{session.code}
                            </code>
                          </div>
                          <div>
                            <strong>Game Code:</strong>
                            <code className="block bg-white p-1 rounded text-xs mt-1 text-center font-bold text-[#0b55d4]">
                              {session.code}
                            </code>
                          </div>
                        </div>
                      </div>

                      {/* Presentation Instructions */}
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p className="text-sm text-purple-800 mb-2">
                          <strong>For Presentation Display:</strong>
                        </p>
                        <div className="text-sm">
                          <strong>Presentation URL:</strong>
                          <code className="block bg-white p-1 rounded text-xs mt-1">
                            {window.location.origin}/presentation/{session.id}
                          </code>
                          <p className="text-xs text-purple-600 mt-1">
                            Open this link on a projector or large screen for
                            audience viewing
                          </p>
                        </div>
                      </div>

                      {/* Contestants List */}
                      {session.contestants &&
                        session.contestants.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">
                              Connected Contestants:
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {session.contestants.map((contestant: any) => (
                                <div
                                  key={contestant.id}
                                  className={`p-2 rounded text-sm ${
                                    contestant.connected
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  <div className="font-medium">
                                    {contestant.name}
                                  </div>
                                  <div className="text-xs">
                                    {contestant.score} pts •{" "}
                                    {contestant.connected
                                      ? "Online"
                                      : "Offline"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
