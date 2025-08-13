import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Copy, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CodeOutput } from "./CodeOutput";
import { AIEditor } from "./AIEditor";
import CodeRunner from "./CodeRunner";
import { generateCppCode } from "@/lib/cppGenerator";

export interface CppStyle {
  naming: 'camelCase' | 'snake_case' | 'PascalCase';
  indentation: '2spaces' | '4spaces' | 'tabs';
  braceStyle: 'K&R' | 'Allman' | 'GNU';
  includeComments: boolean;
}

const CodeGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [style, setStyle] = useState<CppStyle>({
    naming: 'camelCase',
    indentation: '4spaces',
    braceStyle: 'K&R',
    includeComments: true
  });
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what C++ program you want to generate",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const code = generateCppCode(prompt, style);
      setGeneratedCode(code);
      toast({
        title: "Code generated successfully!",
        description: "Your C++ program is ready"
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate C++ code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedCode) return;
    
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Copied to clipboard!",
        description: "C++ code has been copied successfully"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold gradient-text glow-effect">
            C++ Code Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Describe your program in plain English and get clean, customized C++ code instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="code-block">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-primary" />
                  Describe Your Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="e.g., Create a simple calculator that can add, subtract, multiply and divide two numbers with a menu system..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[200px] bg-muted border-border resize-none"
                />
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  {isGenerating ? "Generating..." : "Generate C++ Code"}
                </Button>
              </CardContent>
            </Card>

            {/* Style Configuration */}
            <Card className="code-block">
              <CardHeader>
                <CardTitle>Code Style Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Naming Convention</Label>
                    <Select
                      value={style.naming}
                      onValueChange={(value: CppStyle['naming']) => 
                        setStyle(prev => ({ ...prev, naming: value }))
                      }
                    >
                      <SelectTrigger className="bg-muted">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camelCase">camelCase</SelectItem>
                        <SelectItem value="snake_case">snake_case</SelectItem>
                        <SelectItem value="PascalCase">PascalCase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Indentation</Label>
                    <Select
                      value={style.indentation}
                      onValueChange={(value: CppStyle['indentation']) => 
                        setStyle(prev => ({ ...prev, indentation: value }))
                      }
                    >
                      <SelectTrigger className="bg-muted">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2spaces">2 Spaces</SelectItem>
                        <SelectItem value="4spaces">4 Spaces</SelectItem>
                        <SelectItem value="tabs">Tabs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Brace Style</Label>
                    <Select
                      value={style.braceStyle}
                      onValueChange={(value: CppStyle['braceStyle']) => 
                        setStyle(prev => ({ ...prev, braceStyle: value }))
                      }
                    >
                      <SelectTrigger className="bg-muted">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="K&R">K&R (same line)</SelectItem>
                        <SelectItem value="Allman">Allman (new line)</SelectItem>
                        <SelectItem value="GNU">GNU</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Generated C++ Code</h3>
              {generatedCode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Code
                </Button>
              )}
            </div>
            <CodeOutput code={generatedCode} isGenerating={isGenerating} />
            
            {/* AI Editor */}
            {generatedCode && !isGenerating && (
              <AIEditor 
                code={generatedCode} 
                onCodeUpdated={setGeneratedCode}
              />
            )}
            
            {/* Code Runner */}
            {generatedCode && !isGenerating && (
              <CodeRunner code={generatedCode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;