"use client";

import React, { useState } from "react";

interface EmailPromptBarProps {
  onSubmitted: () => void;  // call when user successfully finishes
}

export default function EmailPromptBar({ onSubmitted }: EmailPromptBarProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, wantContact: false, questions: "", userInfo: "" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit form");
      }
      localStorage.setItem("hasSubmittedEmail", "true");
      onSubmitted();
    } catch (err) {
      const e = err as Error;
      console.error("Form submission error:", e);
      setErrorMessage(e.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t p-3 z-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center space-y-2
                   md:flex-row md:space-y-0 md:space-x-2"
      >
        <label className="block font-medium">
          <span className="mr-1">Enter Email:</span>
          <input
            type="email"
            className="border rounded p-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {errorMessage && (
        <p className="text-red-600 text-sm mt-1 text-center">{errorMessage}</p>
      )}
    </div>
  );
}
