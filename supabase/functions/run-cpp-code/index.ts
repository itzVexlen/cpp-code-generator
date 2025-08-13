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
    const { code, input = "" } = await req.json()

    // Use Judge0 API for code execution
    const judge0Response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': Deno.env.get('RAPIDAPI_KEY') || '',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        source_code: code,
        language_id: 54, // C++ (GCC 9.2.0)
        stdin: input,
        cpu_time_limit: 2,
        memory_limit: 128000
      })
    })

    const submission = await judge0Response.json()
    
    if (!submission.token) {
      throw new Error('Failed to submit code for execution')
    }

    // Poll for result
    let result
    let attempts = 0
    const maxAttempts = 10

    do {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${submission.token}`, {
        headers: {
          'X-RapidAPI-Key': Deno.env.get('RAPIDAPI_KEY') || '',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      })
      
      result = await resultResponse.json()
      attempts++
    } while (result.status.id <= 2 && attempts < maxAttempts)

    return new Response(
      JSON.stringify({
        success: true,
        output: result.stdout || '',
        error: result.stderr || '',
        status: result.status.description,
        time: result.time,
        memory: result.memory
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to execute code' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})