import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Square, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CodeRunnerProps {
  code: string;
}

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  status?: string;
  time?: string;
  memory?: number;
}

const CodeRunner = ({ code }: CodeRunnerProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to run",
        description: "Generate some C++ code first",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setOutput("Compiling and running...\n");

    try {
      const { data, error } = await supabase.functions.invoke('run-cpp-code', {
        body: { code, input }
      });

      if (error) throw error;

      const result: ExecutionResult = data;
      
      if (result.success) {
        let outputText = "";
        
        if (result.output) {
          outputText += `Output:\n${result.output}\n`;
        }
        
        if (result.error) {
          outputText += `\nErrors/Warnings:\n${result.error}\n`;
        }
        
        if (result.time && result.memory) {
          outputText += `\nExecution time: ${result.time}s\nMemory used: ${result.memory} KB`;
        }
        
        outputText += `\nStatus: ${result.status}`;
        
        setOutput(outputText || "Program executed successfully with no output.");
        
        toast({
          title: "Code executed successfully!",
          description: `Completed in ${result.time || 'N/A'}s`
        });
      } else {
        setOutput(`Error: ${result.error || 'Unknown error occurred'}`);
        toast({
          title: "Execution failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to execute code";
      setOutput(`Error: ${errorMessage}`);
      toast({
        title: "Execution failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const stopExecution = () => {
    setIsRunning(false);
    setOutput("Execution stopped by user.");
  };

  return (
    <Card className="code-block">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          Code Runner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Program Input (stdin):</label>
          <Textarea
            placeholder="Enter input for your program (if needed)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[80px] bg-muted border-border font-mono text-sm"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 bg-gradient-primary hover:opacity-90"
          >
            <Play className="w-4 h-4" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>
          
          {isRunning && (
            <Button
              onClick={stopExecution}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Stop
            </Button>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Output:</label>
          <div className="relative">
            <Textarea
              value={output}
              readOnly
              className="min-h-[200px] bg-card border-border font-mono text-sm resize-none"
              placeholder="Program output will appear here..."
            />
            {isRunning && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeRunner;