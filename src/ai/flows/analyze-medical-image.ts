'use server';
/**
 * @fileOverview A Genkit flow to analyze medical images and provide insights.
 *
 * - analyzeMedicalImage - A function that analyzes a medical image.
 * - AnalyzeImageInput - The input type for the analyzeMedicalImage function.
 * - AnalyzeImageOutput - The return type for the analyzeMedicalImage function.
 */

import { ai } from '@/ai/genkit';
import { AnalyzeImageInputSchema, AnalyzeImageOutputSchema, AnalyzeImageInput, AnalyzeImageOutput } from '@/ai/flows/analyze-medical-image.types';

export type { AnalyzeImageInput, AnalyzeImageOutput };

export async function analyzeMedicalImage(
  input: AnalyzeImageInput
): Promise<AnalyzeImageOutput> {
  return analyzeMedicalImageFlow(input);
}

const analyzeImagePrompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: { schema: AnalyzeImageInputSchema },
  output: { schema: AnalyzeImageOutputSchema },
  prompt: `You are an expert AI radiology assistant. Your role is to analyze medical images for doctors, providing preliminary findings and highlighting areas of interest. You are not a replacement for a human radiologist, but an assistant to help them work more efficiently.

Analyze the following medical image.
Image: {{media url=imageUrl}}

{{#if patientContext}}
Consider the following clinical context provided by the doctor: {{{patientContext}}}
{{/if}}

Based on your analysis of the image and any provided context, provide a structured response including:
1.  **observations**: A bullet-point list of key visual findings. Be specific (e.g., "opacity in the lower left lung field," "fracture on the distal radius").
2.  **potentialConditions**: A list of potential conditions that could explain the observations. For each, provide a confidence score from 0.0 to 1.0 and a brief rationale.
3.  **summary**: A short, high-level summary of the most critical findings for a busy doctor.

Your response must be in the specified JSON format. DO NOT provide any diagnosis as a definitive fact. Frame all findings as "potential" or "suggested" for the doctor to review.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ]
  }
});

const analyzeMedicalImageFlow = ai.defineFlow(
  {
    name: 'analyzeMedicalImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeImagePrompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid analysis.");
    }
    return output;
  }
);
