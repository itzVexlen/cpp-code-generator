import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code, editPrompt } = await req.json()

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are a C++ code editor. Your task is to modify the provided C++ code based on the user's edit request. 

Rules:
1. Only output the modified C++ code, nothing else
2. Maintain the original code style and formatting as much as possible
3. Make only the changes requested by the user
4. Ensure the code remains syntactically correct
5. If the request is unclear or impossible, make your best interpretation
6. Preserve comments and structure unless specifically asked to change them`
          },
          {
            role: 'user',
            content: `Here is the C++ code to edit:

\`\`\`cpp
${code}
\`\`\`

Edit request: ${editPrompt}

Please provide only the modified C++ code:`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const editedCode = data.choices[0]?.message?.content?.trim() || ''

    // Clean up the response to remove any markdown formatting
    const cleanCode = editedCode
      .replace(/^```cpp\n?/g, '')
      .replace(/^```c\+\+\n?/g, '')
      .replace(/\n?```$/g, '')
      .trim()

    return new Response(
      JSON.stringify({ editedCode: cleanCode }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})