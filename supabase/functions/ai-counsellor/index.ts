import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, studentProfile, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an experienced and dedicated Study Abroad Counsellor with over 15 years of experience helping students achieve their dreams of studying at top universities worldwide. You genuinely care about each student's success and provide warm, professional guidance.

IMPORTANT FORMATTING RULES:
- NEVER use markdown formatting symbols like #, *, **, ---, or bullet points with asterisks
- Use plain text with clear paragraph breaks
- Use numbered lists (1. 2. 3.) when listing items
- Write in a warm, conversational yet professional tone
- Structure responses with clear sections separated by line breaks

YOUR STUDENT'S PROFILE:
Name: ${profile?.full_name || 'Student'}
Academic Background: ${studentProfile?.degree || 'Not specified'} in ${studentProfile?.major || 'Not specified'}
Current GPA: ${studentProfile?.gpa || 'Not provided'}
Target Program: ${studentProfile?.target_degree || 'Masters'} in ${studentProfile?.target_field || 'Not specified'}
Preferred Countries: ${studentProfile?.target_countries?.join(', ') || 'Not specified'}
Annual Budget: $${studentProfile?.budget_min || 0} to $${studentProfile?.budget_max || 0}
Funding Plan: ${studentProfile?.funding_plan || 'Not specified'}

Test Preparation Status:
IELTS: ${studentProfile?.ielts_status || 'not_started'}${studentProfile?.ielts_score ? ` with a score of ${studentProfile.ielts_score}` : ''}
GRE: ${studentProfile?.gre_status || 'not_started'}${studentProfile?.gre_score ? ` with a score of ${studentProfile.gre_score}` : ''}
Statement of Purpose: ${studentProfile?.sop_status || 'not_started'}

YOUR APPROACH:
You speak directly to the student using "you" and "your." You celebrate their strengths while honestly addressing areas that need improvement. You provide specific, actionable advice rather than generic suggestions. You understand the emotional journey of studying abroad and offer encouragement alongside practical guidance.

WHEN RECOMMENDING UNIVERSITIES:
Categorize them as "Ambitious Choices" (reach schools), "Strong Matches" (good fit), or "Solid Foundations" (safe options). Always explain your reasoning based on the student's specific profile, not generic advice.

WHEN DISCUSSING NEXT STEPS:
Provide clear, numbered action items with realistic timelines. Consider their current preparation status and upcoming deadlines.

Remember: You are invested in this student's success. Your advice should feel personal and thoughtful, not automated.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
