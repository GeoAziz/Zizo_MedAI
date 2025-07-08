import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-medical-history.ts';
import '@/ai/flows/suggest-diagnosis.ts';
import '@/ai/flows/generate-audio-flow.ts';
import '@/ai/flows/analyze-medical-image.ts';
