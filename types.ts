export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type Language = 'en' | 'vi';

export interface TestConfig {
  level: CEFRLevel;
  grammarTopics: string[];
  vocabulary: string;
  part1Count: number; // Grammar/Vocab MCQs
  part2Count: number; // Blanks in text
}

export type Step = 'landing' | 'config' | 'prompt' | 'json' | 'practice' | 'results';

// JSON Data Structure expected from AI
export interface QuestionPart1 {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface BlankPart2 {
  id: number;
  options: string[];
  answer: string;
}

export interface TestPart2 {
  passage: string; // Contains markers like [1], [2]
  blanks: BlankPart2[];
}

export interface QuestionPart3 {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface TestPart3 {
  passage: string;
  questions: QuestionPart3[];
}

export interface TestData {
  part1: QuestionPart1[];
  part2: TestPart2;
  part3: TestPart3;
}

// User Answers
export interface UserAnswers {
  part1: Record<number, string>; // questionId -> selectedOption
  part2: Record<number, string>; // blankId -> selectedOption
  part3: Record<number, string>; // questionId -> selectedOption
}

// Saved Test Structure
export interface SavedTest {
  id: string;
  title: string;
  date: string;
  jsonContent: string; // Stored as string for easy reloading into textarea
}