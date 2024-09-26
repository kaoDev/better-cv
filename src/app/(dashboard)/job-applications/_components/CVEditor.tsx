"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface Props {
  initialMarkdown: string;
  jobApplicationId: string;
  saveCV: (id: string, markdown: string) => Promise<unknown>;
  generateMarkdownCV: (id: string) => Promise<string>;
}

export function CVEditor({
  initialMarkdown,
  jobApplicationId,
  saveCV,
  generateMarkdownCV,
}: Props) {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const interactionDisabled = saving || generating;

  async function handleSave() {
    setSaving(true);
    try {
      await saveCV(jobApplicationId, markdown);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const generatedMarkdown = await generateMarkdownCV(jobApplicationId);
      setMarkdown(generatedMarkdown);
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Markdown CV Editor</h1>
      <div className="mb-4">
        <Button disabled={interactionDisabled} onClick={handleGenerate}>
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate CV"
          )}
        </Button>
      </div>
      <div className="mb-4 lg:hidden">
        <Tabs defaultValue="edit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <textarea
              className="h-[70vh] w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your Markdown here..."
            />
          </TabsContent>
          <TabsContent value="preview">
            <div className="prose max-w-full">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden gap-4 lg:flex">
        <div className="w-1/2">
          <h2 className="mb-2 text-xl font-semibold">Edit</h2>
          <textarea
            disabled={interactionDisabled}
            className="h-[70vh] w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Enter your Markdown here..."
          />
        </div>
        <div className="w-1/2">
          <h2 className="mb-2 text-xl font-semibold">Preview</h2>
          <div className="prose h-[70vh] max-w-full overflow-auto rounded-md border p-4">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button disabled={interactionDisabled} onClick={handleSave}>
          Save CV
        </Button>
      </div>
    </div>
  );
}
