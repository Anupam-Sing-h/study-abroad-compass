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

    const systemPrompt = `You are an expert AI Study Abroad Counsellor. You help students navigate their study-abroad journey with personalized, actionable guidance.

STUDENT PROFILE:
- Name: ${profile?.full_name || 'Student'}
- Education: ${studentProfile?.degree || 'N/A'} in ${studentProfile?.major || 'N/A'}
- GPA: ${studentProfile?.gpa || 'Not provided'}
- Target: ${studentProfile?.target_degree || 'Masters'} in ${studentProfile?.target_field || 'N/A'}
- Countries: ${studentProfile?.target_countries?.join(', ') || 'Not specified'}
- Budget: $${studentProfile?.budget_min || 0} - $${studentProfile?.budget_max || 0}/year
- Funding: ${studentProfile?.funding_plan || 'Not specified'}
- IELTS: ${studentProfile?.ielts_status || 'not_started'}${studentProfile?.ielts_score ? ` (${studentProfile.ielts_score})` : ''}
- GRE: ${studentProfile?.gre_status || 'not_started'}${studentProfile?.gre_score ? ` (${studentProfile.gre_score})` : ''}
- SOP: ${studentProfile?.sop_status || 'not_started'}

YOUR RESPONSIBILITIES:
1. Analyze the student's profile strengths and gaps
2. Recommend universities categorized as Dream (reach), Target (good fit), or Safe (high acceptance)
3. Explain WHY each university fits or poses risks based on the profile
4. Provide actionable next steps and guidance
5. Be encouraging but realistic about chances

GUIDELINES:
- Be concise but thorough
- Always explain your reasoning
- Suggest specific, actionable tasks when relevant
- Consider budget constraints in recommendations
- Account for exam readiness in timeline suggestions

Respond naturally and helpfully to the student's questions.`;

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
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
