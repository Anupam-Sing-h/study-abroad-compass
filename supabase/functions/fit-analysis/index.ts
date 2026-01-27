import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { universityId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Get user from auth header
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Fetch student profile
    const { data: studentProfile } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Fetch university
    const { data: university } = await supabase
      .from("universities")
      .select("*")
      .eq("id", universityId)
      .single();

    if (!university) {
      throw new Error("University not found");
    }

    const systemPrompt = `You are an expert study abroad counsellor AI. Analyze the fit between a student's profile and a university.

STUDENT PROFILE:
- Education: ${studentProfile?.degree || 'N/A'} in ${studentProfile?.major || 'N/A'}
- GPA: ${studentProfile?.gpa || 'Not provided'} / 4.0
- Target: ${studentProfile?.target_degree || 'Masters'} in ${studentProfile?.target_field || 'N/A'}
- Target Countries: ${studentProfile?.target_countries?.join(', ') || 'Not specified'}
- Budget: $${studentProfile?.budget_min || 0} - $${studentProfile?.budget_max || 0}/year
- IELTS: ${studentProfile?.ielts_status || 'not_started'}${studentProfile?.ielts_score ? ` (${studentProfile.ielts_score})` : ''}
- TOEFL: ${studentProfile?.toefl_status || 'not_started'}${studentProfile?.toefl_score ? ` (${studentProfile.toefl_score})` : ''}
- GRE: ${studentProfile?.gre_status || 'not_started'}${studentProfile?.gre_score ? ` (${studentProfile.gre_score})` : ''}
- GMAT: ${studentProfile?.gmat_status || 'not_started'}${studentProfile?.gmat_score ? ` (${studentProfile.gmat_score})` : ''}

UNIVERSITY:
- Name: ${university.name}
- Country: ${university.country}, ${university.city || ''}
- Ranking: #${university.ranking || 'N/A'}
- Tuition: $${university.tuition_min || 0} - $${university.tuition_max || 0}/year
- Programs: ${university.programs?.join(', ') || 'N/A'}
- Requirements:
  - GPA: ${university.gpa_requirement || 'N/A'}
  - IELTS: ${university.ielts_requirement || 'N/A'}
  - TOEFL: ${university.toefl_requirement || 'N/A'}
  - GRE: ${university.gre_requirement || 'N/A'}
  - GMAT: ${university.gmat_requirement || 'N/A'}
- Acceptance Rate: ${university.acceptance_rate ? university.acceptance_rate + '%' : 'N/A'}

Analyze and return a JSON response with:
1. fit_score: 0-100 score based on profile match
2. category: "dream" (reach school), "target" (good match), or "safe" (likely admit)
3. fit_reasons: Array of 2-4 positive reasons why this is a good fit
4. risk_reasons: Array of 2-4 potential risks or gaps to address

Consider: GPA match, test score requirements, budget fit, program alignment, country preference match.`;

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
          { role: "user", content: "Analyze the fit and return the JSON response." }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_fit",
              description: "Returns the fit analysis for student-university match",
              parameters: {
                type: "object",
                properties: {
                  fit_score: { 
                    type: "number",
                    description: "Overall fit score from 0-100" 
                  },
                  category: { 
                    type: "string", 
                    enum: ["dream", "target", "safe"],
                    description: "University category based on admission likelihood"
                  },
                  fit_reasons: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "2-4 positive reasons for the match"
                  },
                  risk_reasons: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "2-4 potential risks or gaps"
                  }
                },
                required: ["fit_score", "category", "fit_reasons", "risk_reasons"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_fit" } }
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
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }
    
    const analysis = JSON.parse(toolCall.function.arguments);

    // Update the shortlist entry with fit analysis
    const { error: updateError } = await supabase
      .from("user_shortlist")
      .update({
        fit_score: analysis.fit_score,
        category: analysis.category,
        fit_reasons: analysis.fit_reasons,
        risk_reasons: analysis.risk_reasons,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.id)
      .eq("university_id", universityId);

    if (updateError) {
      console.error("Error updating shortlist:", updateError);
    }

    return new Response(JSON.stringify(analysis), {
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
