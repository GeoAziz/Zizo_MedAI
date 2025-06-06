// Summarize the medical history to highlight key information, potential risk factors, and relevant past treatments.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMedicalHistoryInputSchema = z.object({
  medicalHistory: z
    .string()
    .describe(
      'The patient medical history to be summarized.'
    ),
});
export type SummarizeMedicalHistoryInput = z.infer<typeof SummarizeMedicalHistoryInputSchema>;

const SummarizeMedicalHistoryOutputSchema = z.object({
  summary: z.string().describe('The summarized medical history.'),
  riskFactors: z.string().describe('Potential risk factors identified.'),
  relevantPastTreatments: z
    .string()
    .describe('Relevant past treatments.'),
});

export type SummarizeMedicalHistoryOutput = z.infer<typeof SummarizeMedicalHistoryOutputSchema>;

export async function summarizeMedicalHistory(
  input: SummarizeMedicalHistoryInput
): Promise<SummarizeMedicalHistoryOutput> {
  return summarizeMedicalHistoryFlow(input);
}

const summarizeMedicalHistoryPrompt = ai.definePrompt({
  name: 'summarizeMedicalHistoryPrompt',
  input: {schema: SummarizeMedicalHistoryInputSchema},
  output: {schema: SummarizeMedicalHistoryOutputSchema},
  prompt: `You are a medical expert summarizing patient medical history to identify key information, potential risk factors and past treatments.

  Summarize the following medical history, and identify potential risk factors and relevant past treatments.

  Medical History: {{{medicalHistory}}}`,
});

const summarizeMedicalHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeMedicalHistoryFlow',
    inputSchema: SummarizeMedicalHistoryInputSchema,
    outputSchema: SummarizeMedicalHistoryOutputSchema,
  },
  async input => {
    const {output} = await summarizeMedicalHistoryPrompt(input);
    return output!;
  }
);
