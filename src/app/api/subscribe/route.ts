// app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";

// For Next.js App Router:
// This is the endpoint that handles form submissions and appends to Google Sheets
export async function POST(request: Request) {
  try {
    const { email, wantContact, questions, userInfo } = await request.json();

    // Basic validation: email is mandatory
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Authenticate with Google
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"] // scopes
    );
    const sheets = google.sheets({ version: "v4", auth });


    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    // The first item in x-forwarded-for is usually the actual client IP
    const ipAddress = forwardedFor.split(",")[0].trim() || "Unknown IP";

    // Append the form data to your Google Sheet
    // Update range and columns as needed
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1!A:E", // e.g. first 4 columns of "Sheet1"
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(), // timestamp
            email,
            wantContact ? "Yes" : "No",
            questions || "",
            userInfo || "",
            ipAddress
          ],
        ],
      },
    });

    return NextResponse.json({ success: true });
} catch (err: unknown) {
    console.error("Error appending to Google Sheets:", err);
    return NextResponse.json({ error: "Failed to append to sheet" }, { status: 500 });
  }
}
