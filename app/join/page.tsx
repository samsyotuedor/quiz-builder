"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  const joinGame = async () => {
    if (!gameCode.trim() || !playerName.trim()) {
      setError("Please enter both game code and your name");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      // Check if game session exists
      const savedSessions = localStorage.getItem("gameSessions");
      if (!savedSessions) {
        throw new Error(
          "No active game sessions found. Please make sure the host has created a session."
        );
      }

      const sessions = JSON.parse(savedSessions);
      const session = sessions.find(
        (s: any) => s.code.toUpperCase() === gameCode.toUpperCase()
      );

      if (!session) {
        throw new Error(
          "Game code not found. Please check the code and try again."
        );
      }

      if (session.status === "finished") {
        throw new Error("This game session has already finished.");
      }

      // Create contestant session
      const contestantData = {
        id: Date.now().toString(),
        name: playerName.trim(),
        gameCode: gameCode.toUpperCase(),
        sessionId: session.id,
        score: 0,
        connected: true,
        joinedAt: new Date().toISOString(),
      };

      // Add contestant to session
      session.contestants = session.contestants || [];
      const existingContestant = session.contestants.find(
        (c: any) => c.name === playerName.trim()
      );

      if (existingContestant) {
        // Update existing contestant
        existingContestant.connected = true;
        contestantData.id = existingContestant.id;
        contestantData.score = existingContestant.score;
      } else {
        // Add new contestant
        session.contestants.push(contestantData);
      }

      // Update sessions in localStorage
      const updatedSessions = sessions.map((s: any) =>
        s.id === session.id ? session : s
      );
      localStorage.setItem("gameSessions", JSON.stringify(updatedSessions));

      // Store contestant session
      localStorage.setItem("contestantSession", JSON.stringify(contestantData));

      // Redirect to waiting room
      router.push(`/contestant/waiting/${session.id}`);
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
              Enter the game code provided by your host
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gamepad2 className="mr-2 h-5 w-5" />
                Game Details
              </CardTitle>
              <CardDescription>
                Enter your information to join the quiz session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="game-code">Game Code</Label>
                <Input
                  id="game-code"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code (e.g., ABC123)"
                  className="mt-1 text-center text-lg font-mono"
                  maxLength={6}
                />
              </div>

              <div>
                <Label htmlFor="player-name">Your Name</Label>
                <Input
                  id="player-name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button
                onClick={joinGame}
                disabled={isJoining || !gameCode.trim() || !playerName.trim()}
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

          {/* Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">How to Join</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="bg-[#0b55d4] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </span>
                  <p>Get the 6-digit game code from your quiz host</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-[#0b55d4] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </span>
                  <p>Enter the code and your name above</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-[#0b55d4] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </span>
                  <p>Wait for the host to start the game</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-[#0b55d4] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    4
                  </span>
                  <p>Answer questions and compete for points!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
