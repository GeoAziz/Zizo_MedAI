'use server';
/**
 * @fileOverview A Genkit flow to analyze medical images and provide insights.
 *
 * - analyzeMedicalImage - A function that analyzes a medical image.
 * - AnalyzeImageInput - The input type for the analyzeMedicalImage function.
 * - AnalyzeImageOutput - The return type for the analyzeMedicalImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeImageInputSchema = z.object({
  imageUrl: z
    .string()
    .url()
    .describe('The public URL of the medical image to analyze.'),
  patientContext: z
    .string()
    .optional()
    .describe(
      'Optional clinical context about the patient or what to look for.'
    ),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

export const AnalyzeImageOutputSchema = z.object({
  observations: z
    .array(z.string())
    .describe('A list of key visual observations from the image.'),
  potentialConditions: z
    .array(
      z.object({
        condition: z.string().describe('The name of the potential condition.'),
        confidence: z
          .number()
          .min(0)
          .max(1)
          .describe('The confidence level (0-1) for this condition.'),
        rationale: z
          .string()
          .describe('The reasoning behind suggesting this condition.'),
      })
    )
    .describe('An array of potential conditions suggested by the analysis.'),
  summary: z
    .string()
    .describe(
      'A concise, high-level summary of the findings for the doctor.'
    ),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeMedicalImage(
  input: AnalyzeImageInput
): Promise<AnalyzeImageOutput> {
  return analyzeMedicalImageFlow(input);
}

const analyzeImagePrompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
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
});

const analyzeMedicalImageFlow = ai.defineFlow(
  {
    name: 'analyzeMedicalImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async (input) => {
    const {output} = await analyzeImagePrompt(input);
    if (!output) {
        throw new Error("The AI model did not return a valid analysis.");
    }
    return output;
  }
);
