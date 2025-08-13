import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CodeOutputProps {
  code: string;
  isGenerating: boolean;
}

export const CodeOutput = ({ code, isGenerating }: CodeOutputProps) => {
  const highlightSyntax = (code: string) => {
    if (!code) return '';
    
    return code
      .replace(/\b(#include|#define|#ifdef|#ifndef|#endif|using|namespace)\b/g, '<span class="syntax-keyword">$1</span>')
      .replace(/\b(int|float|double|char|string|bool|void|class|struct|public|private|protected|const|static|virtual|return|if|else|for|while|do|switch|case|break|continue|try|catch)\b/g, '<span class="syntax-keyword">$1</span>')
      .replace(/\b(std|cout|cin|endl|vector|map|set|list|queue|stack|iostream|fstream|sstream)\b/g, '<span class="syntax-type">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="syntax-string">"$1"</span>')
      .replace(/'([^']*)'/g, '<span class="syntax-string">\'$1\'</span>')
      .replace(/\/\/.*$/gm, '<span class="syntax-comment">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="syntax-comment">$&</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="syntax-number">$1</span>');
  };

  if (isGenerating) {
    return (
      <Card className="code-block h-[600px]">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Generating your C++ code...</span>
          </div>
          <div className="space-y-2">
            {Array.from({ length: 15 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className="h-4 bg-muted/50" 
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!code) {
    return (
      <Card className="code-block h-[600px]">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-glow rounded-full mx-auto opacity-50"></div>
            <p className="text-muted-foreground">
              Your generated C++ code will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="code-block h-[600px]">
      <CardContent className="p-0">
        <div className="bg-muted/30 border-b border-border px-4 py-2 flex items-center space-x-2">
          <div className="w-3 h-3 bg-destructive rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-4 text-sm text-muted-foreground font-mono">main.cpp</span>
        </div>
        <div className="p-6 h-[calc(100%-60px)] overflow-auto">
          <pre className="text-sm font-mono leading-relaxed">
            <code 
              dangerouslySetInnerHTML={{ 
                __html: highlightSyntax(code) 
              }}
            />
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};