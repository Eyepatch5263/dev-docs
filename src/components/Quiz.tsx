"use client";

import { useState } from "react";
import { Check, X, ArrowRight, RotateCcw, Award } from "lucide-react";
import { cn } from "@/lib/utils";

import { Question } from "@/lib/quiz";

interface QuizProps {
  questions: Question[];
}

export function Quiz({ questions }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [history, setHistory] = useState<
    { selected: number; correct: boolean }[]
  >([]);

  if (!questions || questions.length === 0) return null;

  const currentQuestion = questions[currentIdx];

  const handleOptionSelect = (optionIdx: number) => {
    if (showFeedback) return;
    setSelectedIdx(optionIdx);
  };

  const handleSubmit = () => {
    if (selectedIdx === null || showFeedback) return;

    const isCorrect = selectedIdx === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setHistory((prev) => [
      ...prev,
      { selected: selectedIdx, correct: isCorrect },
    ]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setShowFeedback(false);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setShowFeedback(false);
    setScore(0);
    setIsFinished(false);
    setHistory([]);
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="my-8 p-6 rounded-2xl border border-border bg-card shadow-xl text-center w-full animate-in fade-in duration-300">
        <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
          <Award className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
        <p className="text-muted-foreground mb-6">
          You scored{" "}
          <span className="font-semibold text-foreground">{score}</span> out of{" "}
          <span className="font-semibold text-foreground">
            {questions.length}
          </span>{" "}
          ({percentage}%)
        </p>

        {/* Score Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3 mb-8 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              percentage >= 70
                ? "bg-green-500"
                : percentage >= 40
                  ? "bg-yellow-500"
                  : "bg-red-500",
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="space-y-4 mb-8 text-left">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Review Results
          </h4>
          {questions.map((q, idx) => {
            const hist = history[idx];
            const wasCorrect = hist?.correct;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50 text-sm"
              >
                {wasCorrect ? (
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-foreground">{q.question}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Your answer:{" "}
                    <span className="italic">{q.options[hist?.selected]}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleRestart}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className=" my-8 p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-lg w-full animate-in fade-in duration-300">
      {/* Header / Progress */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Question {currentIdx + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-6 h-1 rounded-full transition-colors",
                i === currentIdx
                  ? "bg-primary"
                  : i < currentIdx
                    ? "bg-primary/40"
                    : "bg-muted",
              )}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <h3 className="text-lg md:text-xl font-bold mb-6 text-foreground leading-snug">
        {currentQuestion.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = idx === currentQuestion.correctIndex;

          let optionStyles =
            "border-border hover:border-primary/50 hover:bg-muted/30";
          if (isSelected) {
            optionStyles = "border-primary bg-primary/5 dark:bg-primary/10";
          }
          if (showFeedback) {
            if (isCorrect) {
              optionStyles =
                "border-green-500/80 bg-green-500/10 text-green-900 dark:text-green-200";
            } else if (isSelected) {
              optionStyles =
                "border-red-500/80 bg-red-500/10 text-red-900 dark:text-red-200";
            } else {
              optionStyles = "border-border opacity-60";
            }
          }

          return (
            <button
              key={idx}
              disabled={showFeedback}
              onClick={() => handleOptionSelect(idx)}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between gap-4 text-sm font-medium",
                optionStyles,
                !showFeedback && "cursor-pointer",
              )}
            >
              <span>{option}</span>
              <div className="shrink-0">
                {showFeedback ? (
                  isCorrect ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                      <X className="w-3.5 h-3.5" />
                    </div>
                  ) : null
                ) : (
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30",
                    )}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation & Controls */}
      <div className="space-y-4">
        {showFeedback && (
          <div className="p-4 rounded-xl bg-muted/50 border border-border text-sm leading-relaxed animate-in slide-in-from-bottom-2 duration-200">
            <p className="font-semibold text-foreground mb-1">
              {selectedIdx === currentQuestion.correctIndex
                ? "🎉 Correct!"
                : "❌ Incorrect"}
            </p>
            <p className="text-muted-foreground">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          {!showFeedback ? (
            <button
              onClick={handleSubmit}
              disabled={selectedIdx === null}
              className={cn(
                "px-6 py-2.5 rounded-xl font-semibold shadow-md transition-all",
                selectedIdx === null
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90 cursor-pointer",
              )}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all cursor-pointer shadow-md"
            >
              {currentIdx < questions.length - 1
                ? "Next Question"
                : "Show Results"}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
