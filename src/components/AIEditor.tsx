import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIEditorProps {
  code: string;
  onCodeUpdated: (newCode: string) => void;
}

export const AIEditor = ({ code, onCodeUpdated }: AIEditorProps) => {
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleAIEdit = async () => {
    if (!editPrompt.trim()) {
      toast({
        title: "Please enter an edit request",
        description: "Describe what changes you want to make to the code",
        variant: "destructive"
      });
      return;
    }

    if (!code.trim()) {
      toast({
        title: "No code to edit",
        description: "Please generate some code first before editing",
        variant: "destructive"
      });
      return;
    }

    setIsEditing(true);
    try {
      const { data, error } = await supabase.functions.invoke('edit-cpp-code', {
        body: {
          code: code,
          editPrompt: editPrompt
        }
      });

      if (error) throw error;

      if (data?.editedCode) {
        onCodeUpdated(data.editedCode);
        setEditPrompt("");
        toast({
          title: "Code edited successfully!",
          description: "Your C++ code has been updated with AI suggestions"
        });
      } else {
        throw new Error("No edited code received");
      }
    } catch (error) {
      console.error('AI edit error:', error);
      toast({
        title: "Edit failed",
        description: error.message || "Failed to edit code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <Card className="code-block">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Code Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="e.g., Add error handling, optimize the algorithm, add more comments, change variable names to snake_case..."
          value={editPrompt}
          onChange={(e) => setEditPrompt(e.target.value)}
          className="min-h-[100px] bg-muted border-border resize-none"
          disabled={isEditing}
        />
        <Button 
          onClick={handleAIEdit}
          disabled={isEditing || !code.trim()}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {isEditing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Editing Code...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Edit with AI
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          Describe any changes you want to make to the generated code. The AI will modify it while preserving your style preferences.
        </p>
      </CardContent>
    </Card>
  );
};