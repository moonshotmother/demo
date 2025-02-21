"use client";
import React, { useState } from "react";

interface EmailPromptModalProps {
  onClose: () => void;           // Called when user successfully submits
  onDismiss: () => void;         // Called when user dismisses without submitting
}

export default function EmailPromptModal({
  onClose,
  onDismiss,
}: EmailPromptModalProps) {
  const [email, setEmail] = useState("");
  const [wantContact, setWantContact] = useState(false);
  const [questions, setQuestions] = useState("");
  const [userInfo, setUserInfo] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, wantContact, questions, userInfo }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit form");
      }

      // Mark as submitted in localStorage
      localStorage.setItem("hasSubmittedEmail", "true");

      setSuccessMessage("Thanks for your submission!");
      // You can wait a moment or just immediately call onClose
      onClose();
    } catch (err) {
      const e = err as Error;
      console.error("Form submission error:", e);
      setErrorMessage(e.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4 relative">
        <h2 className="text-xl font-bold mb-2">Thanks for using the demo!</h2>
        <p className="text-gray-700 mb-4">
          You’ve been on the site for around 1 minute. Please enter your email
          and any other details you feel comfortable sharing. Afterwards, you’ll have
          unlimited free use on this device.
        </p>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-2 mb-2 rounded">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-2 mb-2 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">
            Email (required)
            <input
              type="email"
              className="block w-full mt-1 p-2 border rounded"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={wantContact}
              onChange={(e) => setWantContact(e.target.checked)}
            />
            <span>Yes, please reach out to me for a private showcase</span>
          </label>

          <label className="block mb-2 font-medium">
            Questions or Feedback
            <textarea
              className="block w-full mt-1 p-2 border rounded"
              rows={3}
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
            />
          </label>

          <label className="block mb-2 font-medium">
            Additional Info (e.g. name, company, interests)
            <textarea
              className="block w-full mt-1 p-2 border rounded"
              rows={3}
              value={userInfo}
              onChange={(e) => setUserInfo(e.target.value)}
            />
          </label>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={onDismiss}
            >
              Dismiss
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
