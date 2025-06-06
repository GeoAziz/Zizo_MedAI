// src/ai/flows/suggest-diagnosis.ts
'use server';
/**
 * @fileOverview A flow to suggest potential diagnoses based on user-provided symptoms.
 *
 * - suggestDiagnosis - A function that suggests diagnoses based on symptoms.
 * - SuggestDiagnosisInput - The input type for the suggestDiagnosis function.
 * - SuggestDiagnosisOutput - The return type for the suggestDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDiagnosisInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the patient’s symptoms.'),
  medicalHistory: z
    .string()
    .optional()
    .describe('The patient’s relevant past medical history, if any.'),
});
export type SuggestDiagnosisInput = z.infer<typeof SuggestDiagnosisInputSchema>;

const DiagnosisSchema = z.object({
  diagnosis: z.string().describe('The potential diagnosis.'),
  confidence: z.number().describe('The confidence level (0-1) for this diagnosis.'),
  rationale: z.string().describe('The rationale behind this diagnosis based on the symptoms.'),
});

const SuggestDiagnosisOutputSchema = z.array(DiagnosisSchema).describe('An array of potential diagnoses with confidence levels and rationales.');
export type SuggestDiagnosisOutput = z.infer<typeof SuggestDiagnosisOutputSchema>;

export async function suggestDiagnosis(input: SuggestDiagnosisInput): Promise<SuggestDiagnosisOutput> {
  return suggestDiagnosisFlow(input);
}

const suggestDiagnosisPrompt = ai.definePrompt({
  name: 'suggestDiagnosisPrompt',
  input: {schema: SuggestDiagnosisInputSchema},
  output: {schema: SuggestDiagnosisOutputSchema},
  prompt: `You are an AI medical diagnostic assistant. Given the following symptoms and medical history, suggest a list of potential diagnoses, along with a confidence level (0-1) for each diagnosis and a brief rationale.

Symptoms: {{{symptoms}}}
Medical History: {{{medicalHistory}}}

Provide the output as a JSON array of diagnoses, where each diagnosis includes the diagnosis name, confidence level, and rationale.

Example:
[
  {
    "diagnosis": "Common Cold",
    "confidence": 0.8,
    "rationale": "Based on the symptoms of cough, runny nose, and fatigue."
  },
  {
    "diagnosis": "Influenza",
    "confidence": 0.6,
    "rationale": "Possible due to fever and body aches in addition to cold-like symptoms."
  }
]
`,
});

const suggestDiagnosisFlow = ai.defineFlow(
  {
    name: 'suggestDiagnosisFlow',
    inputSchema: SuggestDiagnosisInputSchema,
    outputSchema: SuggestDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await suggestDiagnosisPrompt(input);
    return output!;
  }
);
