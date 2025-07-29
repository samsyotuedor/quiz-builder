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
import { Label } from "@/components/ui/label";
import { Users, Gamepad2, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function JoinWithCodePage() {
  const router = useRouter();
  const params = useParams();
  const gameCode = params.code as string;
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    if (gameCode) {
      // Check if session exists
      const savedSessions = localStorage.getItem("gameSessions");
      if (savedSessions) {
        const sessions = JSON.parse(savedSessions);
        const session = sessions.find(
          (s: any) => s.code.toUpperCase() === gameCode.toUpperCase()
        );
        if (session) {
          setSessionInfo(session);
        } else {
          setError("Game session not found. Please check the game code.");
        }
      } else {
        setError(
          "No active game sessions found. Please make sure the host has created a session."
        );
      }
    }
  }, [gameCode]);

  const joinGame = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!sessionInfo) {
      setError("Game session not found");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      if (sessionInfo.status === "finished") {
        throw new Error("This game session has already finished.");
      }

      // Create contestant session
      const contestantData = {
        id: Date.now().toString(),
        name: playerName.trim(),
        gameCode: gameCode.toUpperCase(),
        sessionId: sessionInfo.id,
        score: 0,
        connected: true,
        joinedAt: new Date().toISOString(),
      };

      // Add contestant to session
      sessionInfo.contestants = sessionInfo.contestants || [];
      const existingContestant = sessionInfo.contestants.find(
        (c: any) => c.name === playerName.trim()
      );

      if (existingContestant) {
        // Update existing contestant
        existingContestant.connected = true;
        contestantData.id = existingContestant.id;
        contestantData.score = existingContestant.score;
      } else {
        // Add new contestant
        sessionInfo.contestants.push(contestantData);
      }

      // Update sessions in localStorage
      const savedSessions = localStorage.getItem("gameSessions");
      if (savedSessions) {
        const sessions = JSON.parse(savedSessions);
        const updatedSessions = sessions.map((s: any) =>
          s.id === sessionInfo.id ? sessionInfo : s
        );
        localStorage.setItem("gameSessions", JSON.stringify(updatedSessions));
      }

      // Store contestant session
      localStorage.setItem("contestantSession", JSON.stringify(contestantData));

      // Redirect to waiting room
      router.push(`/contestant/waiting/${sessionInfo.id}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#0b55d4] rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">QuizBuilder</h1>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0b55d4] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join Quiz Game
            </h2>
            <p className="text-gray-600">
              Game Code: <strong className="text-[#0b55d4]">{gameCode}</strong>
            </p>
          </div>

          {sessionInfo && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-center">
                  {sessionInfo.title}
                </CardTitle>
                <CardDescription className="text-center">
                  {sessionInfo.questionCount} questions •{" "}
                  {sessionInfo.contestants?.length || 0} contestants joined
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gamepad2 className="mr-2 h-5 w-5" />
                Enter Your Name
              </CardTitle>
              <CardDescription>
                Join the quiz session and compete with other contestants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="player-name">Your Name</Label>
                <Input
                  id="player-name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1"
                  onKeyPress={(e) => e.key === "Enter" && joinGame()}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button
                onClick={joinGame}
                disabled={isJoining || !playerName.trim() || !sessionInfo}
                className="w-full bg-[#0b55d4] hover:bg-[#0a4bc2]"
              >
                {isJoining ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Joining Game...
                  </div>
                ) : (
                  "Join Game"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Game Info */}
          {sessionInfo && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Game Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="font-bold text-[#0b55d4]">
                      {sessionInfo.questionCount}
                    </div>
                    <div className="text-gray-600">Questions</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="font-bold text-[#0b55d4]">
                      {sessionInfo.contestants?.length || 0}
                    </div>
                    <div className="text-gray-600">Contestants</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
