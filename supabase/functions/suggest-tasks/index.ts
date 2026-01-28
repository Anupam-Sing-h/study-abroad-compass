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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Fetch student profile
    const { data: studentProfile } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Fetch locked universities
    const { data: lockedUniversities } = await supabase
      .from("user_shortlist")
      .select("*, university:universities(*)")
      .eq("user_id", user.id)
      .eq("is_locked", true);

    // Fetch existing tasks to avoid duplicates
    const { data: existingTasks } = await supabase
      .from("tasks")
      .select("title")
      .eq("user_id", user.id);

    const existingTitles = new Set((existingTasks || []).map(t => t.title.toLowerCase()));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const currentStage = profile?.current_stage || 1;

    const systemPrompt = `You are an expert study abroad counsellor AI that generates personalized, actionable tasks for students.

STUDENT PROFILE:
- Name: ${profile?.full_name || 'Student'}
- Current Stage: ${currentStage} (1=Building Profile, 2=Discovering Unis, 3=Finalizing, 4=Applying)
- Education: ${studentProfile?.degree || 'N/A'} in ${studentProfile?.major || 'N/A'}
- GPA: ${studentProfile?.gpa || 'Not provided'}
- Target: ${studentProfile?.target_degree || 'Masters'} in ${studentProfile?.target_field || 'N/A'}
- Target Countries: ${studentProfile?.target_countries?.join(', ') || 'Not specified'}
- Target Intake: ${studentProfile?.target_intake_year || 'Not specified'}
- Budget: $${studentProfile?.budget_min || 0} - $${studentProfile?.budget_max || 0}/year
- Funding: ${studentProfile?.funding_plan || 'Not specified'}

EXAM STATUS:
- IELTS: ${studentProfile?.ielts_status || 'not_started'}${studentProfile?.ielts_score ? ` (Score: ${studentProfile.ielts_score})` : ''}
- TOEFL: ${studentProfile?.toefl_status || 'not_started'}${studentProfile?.toefl_score ? ` (Score: ${studentProfile.toefl_score})` : ''}
- GRE: ${studentProfile?.gre_status || 'not_started'}${studentProfile?.gre_score ? ` (Score: ${studentProfile.gre_score})` : ''}
- GMAT: ${studentProfile?.gmat_status || 'not_started'}${studentProfile?.gmat_score ? ` (Score: ${studentProfile.gmat_score})` : ''}
- SOP: ${studentProfile?.sop_status || 'not_started'}

LOCKED UNIVERSITIES (${lockedUniversities?.length || 0}):
${lockedUniversities?.map(u => `- ${u.university?.name} (${u.university?.country}) - Deadline: ${u.university?.application_deadline || 'Not specified'}`).join('\n') || 'None yet'}

EXISTING TASKS (avoid duplicates):
${[...existingTitles].slice(0, 10).join(', ') || 'None'}

TASK GENERATION RULES:
1. Generate 3-5 highly relevant tasks based on the student's current gaps and stage
2. Each task should be specific and actionable
3. Prioritize based on urgency (upcoming deadlines, missing prerequisites)
4. Include a mix of categories: exams, documents, research, applications
5. Set realistic due dates based on the target intake year
6. DO NOT suggest tasks that are already in the existing tasks list

Return ONLY a JSON array of tasks with this exact structure:
[
  {
    "title": "Clear, actionable task title",
    "description": "Detailed description with specific steps",
    "category": "exams|documents|research|applications|finance|other",
    "priority": "high|medium|low",
    "due_days": number (days from now)
  }
]`;

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
          { role: "user", content: "Generate personalized tasks based on my profile gaps and deadlines." }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_tasks",
              description: "Return 3-5 actionable task suggestions based on the student profile.",
              parameters: {
                type: "object",
                properties: {
                  tasks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        category: { type: "string", enum: ["exams", "documents", "research", "applications", "finance", "other"] },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                        due_days: { type: "number" }
                      },
                      required: ["title", "description", "category", "priority", "due_days"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["tasks"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "suggest_tasks" } }
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
    
    let suggestedTasks: Array<{
      title: string;
      description: string;
      category: string;
      priority: string;
      due_days: number;
    }> = [];

    // Extract from tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      suggestedTasks = parsed.tasks || [];
    }

    // Filter out duplicates
    suggestedTasks = suggestedTasks.filter(
      task => !existingTitles.has(task.title.toLowerCase())
    );

    return new Response(JSON.stringify({ tasks: suggestedTasks }), {
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
