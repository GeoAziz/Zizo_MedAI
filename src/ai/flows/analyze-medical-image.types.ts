import { z } from 'genkit';

export const AnalyzeImageInputSchema = z.object({
  imageUrl: z.string().describe('URL of the medical image to analyze.'),
  patientContext: z.string().optional().describe('Optional clinical context for the image.'),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

export const AnalyzeImageOutputSchema = z.object({
  observations: z.array(z.string()).describe('Key visual findings from the image.'),
  potentialConditions: z.array(
    z.object({
      condition: z.string().describe('Potential condition name.'),
      confidence: z.number().describe('Confidence score (0.0 to 1.0).'),
      rationale: z.string().describe('Brief rationale for the condition.'),
    })
  ).describe('List of potential conditions with confidence and rationale.'),
  summary: z.string().describe('High-level summary of critical findings.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;
