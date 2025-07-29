"use client";

import type React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  Database,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Question {
  id?: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  order_index: number;
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: 0,
    explanation: "",
  });

  useEffect(() => {}, []);

  const addQuestion = () => {
    if (
      currentQuestion.question &&
      currentQuestion.options.every((opt) => opt.trim())
    ) {
      const newQuestion: Question = {
        ...currentQuestion,
        order_index: questions.length,
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correct_answer: 0,
        explanation: "",
      });
    }
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    // Update order_index for remaining questions
    const reorderedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      order_index: i,
    }));
    setQuestions(reorderedQuestions);
  };

  const saveQuiz = () => {
    if (!quizTitle.trim() || questions.length === 0) {
      setUploadStatus(
        "Please enter a quiz title and add at least one question"
      );
      return;
    }

    setIsSaving(true);
    setUploadStatus("Saving quiz...");

    try {
      const quiz = {
        id: Date.now().toString(),
        title: quizTitle.trim(),
        description: quizDescription.trim(),
        questions: questions.map((q, index) => ({
          id: `q${index + 1}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
        })),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("currentQuiz", JSON.stringify(quiz));
      setUploadStatus(
        `Quiz saved successfully! ${questions.length} questions added.`
      );

      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (error: any) {
      setUploadStatus(`Error saving quiz: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("Processing file...");

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    try {
      if (fileType.includes("csv") || fileName.endsWith(".csv")) {
        await handleCSVFile(file);
      } else if (fileType.includes("text") || fileName.endsWith(".txt")) {
        await handleTextFile(file);
      } else {
        await handleTextFile(file);
      }
    } catch (error) {
      setUploadStatus(`Error processing file: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCSVFile = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          parseCSVContent(content);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject("Failed to read CSV file");
      reader.readAsText(file, "UTF-8");
    });
  };

  const handleTextFile = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          parseTextContent(content);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject("Failed to read text file");
      reader.readAsText(file, "UTF-8");
    });
  };

  const parseCSVContent = (content: string) => {
    const lines = content.split("\n").filter((line) => line.trim());
    const parsedQuestions: Question[] = [];

    lines.forEach((line, index) => {
      // Handle CSV with quotes and commas properly
      const parts = line
        .split(",")
        .map((part) => part.trim().replace(/^"|"$/g, ""));

      if (parts.length >= 6) {
        // Expected format: Question, Option1, Option2, Option3, Option4, CorrectAnswerIndex, Explanation
        let correctAnswerIndex = 0;

        // Handle both numeric index (0-3) and letter format (A-D)
        const answerPart = parts[5].trim().toUpperCase();
        if (answerPart.match(/^[A-D]$/)) {
          // Convert letter to index: A=0, B=1, C=2, D=3
          correctAnswerIndex = answerPart.charCodeAt(0) - 65;
        } else {
          // Assume it's a numeric index
          correctAnswerIndex = Math.max(
            0,
            Math.min(3, Number.parseInt(answerPart) || 0)
          );
        }

        parsedQuestions.push({
          question: parts[0],
          options: [parts[1], parts[2], parts[3], parts[4]],
          correct_answer: correctAnswerIndex,
          explanation: parts[6] || "",
          order_index: questions.length + index,
        });
      }
    });

    if (parsedQuestions.length > 0) {
      setQuestions([...questions, ...parsedQuestions]);
      setUploadStatus(
        `Successfully imported ${parsedQuestions.length} questions!`
      );
    } else {
      setUploadStatus(
        "No valid questions found. Please check your CSV format."
      );
    }
  };

  const parseTextContent = (content: string) => {
    const lines = content.split("\n").filter((line) => line.trim());
    const parsedQuestions: Question[] = [];

    let currentQuestion: any = {};
    let questionCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      // Check if line starts with a number (question)
      if (/^\d+\./.test(line)) {
        // Save previous question if complete
        if (
          currentQuestion.question &&
          currentQuestion.options &&
          currentQuestion.options.length === 4
        ) {
          parsedQuestions.push({
            question: currentQuestion.question,
            options: currentQuestion.options,
            correct_answer: currentQuestion.correct_answer || 0,
            explanation: currentQuestion.explanation || "",
            order_index: questions.length + questionCount,
          });
          questionCount++;
        }

        // Start new question
        currentQuestion = {
          question: line.replace(/^\d+\.\s*/, ""),
          options: [],
          correct_answer: 0,
          explanation: "",
        };
      }
      // Check if line is an option (A., B., C., D.)
      else if (/^[A-D]\./.test(line)) {
        if (currentQuestion.options) {
          currentQuestion.options.push(line.replace(/^[A-D]\.\s*/, ""));
        }
      }
      // Check for answer indicator - Updated to handle "Answer: C" format
      else if (line.toLowerCase().includes("answer:")) {
        const answerMatch = line.match(/answer:\s*([A-D])/i);
        if (answerMatch) {
          const answerLetter = answerMatch[1].toUpperCase();
          currentQuestion.correct_answer = answerLetter.charCodeAt(0) - 65; // Convert A=0, B=1, C=2, D=3
        }
      }
      // Check for explanation
      else if (line.toLowerCase().includes("explanation:")) {
        currentQuestion.explanation = line.replace(/explanation:\s*/i, "");
      }
    }

    // Don't forget the last question
    if (
      currentQuestion.question &&
      currentQuestion.options &&
      currentQuestion.options.length === 4
    ) {
      parsedQuestions.push({
        question: currentQuestion.question,
        options: currentQuestion.options,
        correct_answer: currentQuestion.correct_answer || 0,
        explanation: currentQuestion.explanation || "",
        order_index: questions.length + questionCount,
      });
    }

    if (parsedQuestions.length > 0) {
      setQuestions([...questions, ...parsedQuestions]);
      setUploadStatus(
        `Successfully imported ${parsedQuestions.length} questions!`
      );
    } else {
      setUploadStatus(
        "No valid questions found. Please check your file format."
      );
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
              <h1 className="text-2xl font-bold text-gray-900">QuizBuilder</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Button
                onClick={saveQuiz}
                disabled={isSaving}
                className="bg-[#0b55d4] hover:bg-[#0a4bc2]"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Save Quiz
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Create New Quiz
          </h2>

          {/* Quiz Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quiz-title">Quiz Title *</Label>
                  <Input
                    id="quiz-title"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Enter quiz title..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="quiz-description">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="quiz-description"
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    placeholder="Enter quiz description..."
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Questions</CardTitle>
              <CardDescription>
                Upload questions from CSV or text files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-[#0b55d4] hover:text-[#0a4bc2]">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <p className="text-sm text-gray-500">
                    CSV or TXT files up to 10MB
                  </p>
                </div>
              </div>

              {/* Upload Status */}
              {(uploadStatus || isUploading) && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center space-x-2">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0b55d4]"></div>
                    ) : (
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                    )}
                    <span className="text-sm text-blue-800">
                      {uploadStatus}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Question Manually */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add Question Manually</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    value={currentQuestion.question}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        question: e.target.value,
                      })
                    }
                    placeholder="Enter your question..."
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index}>
                      <Label htmlFor={`option-${index}`}>
                        Option {index + 1}
                      </Label>
                      <Input
                        id={`option-${index}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion({
                            ...currentQuestion,
                            options: newOptions,
                          });
                        }}
                        placeholder={`Enter option ${index + 1}...`}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="correct-answer">Correct Answer</Label>
                  <Select
                    value={currentQuestion.correct_answer.toString()}
                    onValueChange={(value) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        correct_answer: Number.parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentQuestion.options.map((option, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          Option {index + 1}: {option || `Option ${index + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="explanation">Explanation (Optional)</Label>
                  <Textarea
                    id="explanation"
                    value={currentQuestion.explanation}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        explanation: e.target.value,
                      })
                    }
                    placeholder="Explain why this is the correct answer..."
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={addQuestion}
                  className="bg-[#0b55d4] hover:bg-[#0a4bc2]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          {questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Questions ({questions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">Question {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-gray-700 mb-2">{question.question}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded ${
                              optIndex === question.correct_answer
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100"
                            }`}
                          >
                            {optIndex + 1}. {option}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
