import { TestConfig, TestData, Language } from "./types";

export const generatePrompt = (config: TestConfig, lang: Language): string => {
  const grammarSection = config.grammarTopics.length > 0 
    ? `   - **Grammar Focus**: Specifically test these topics: ${config.grammarTopics.join(', ')}.` 
    : "   - **Grammar Focus**: Include a diverse range of grammatical structures appropriate for this CEFR level.";
  
  const vocabSection = config.vocabulary.trim().length > 0
    ? `   - **Target Vocabulary**: Contextually integrate these words into the Reading Text and Questions: ${config.vocabulary.split('\n').map(s => s.trim()).filter(Boolean).join(', ')}.`
    : "";

  // Logic for Vietnamese Explanations
  const explanationInstruction = lang === 'vi' 
    ? "IMPORTANT: The 'question', 'options', 'passage' must be in English. However, the 'explanation' field MUST be provided in VIETNAMESE to help a Vietnamese student understand why the answer is correct."
    : "Explanations must be detailed and helpful for self-study, in English.";

  return `You are an expert ESL/EFL Assessment Designer (Cambridge/Oxford style). 
Your task is to create a high-quality, cohesive English practice test for **CEFR Level ${config.level}**.

### 1. DESIGN GUIDELINES
- **Theme**: Select a single, engaging theme for the reading passages (e.g., Sustainable Tech, Modern Travel, Cultural Habits, Psychology).
- **Tone**: Professional, educational, yet interesting for adults/young adults.
- **Pedagogy**: 
    - Questions should test nuances, collocations, and context, not just rote memorization.
    - **Distractors** (wrong answers) must be plausible but clearly incorrect to a proficient user.
    - ${explanationInstruction}
${grammarSection}
${vocabSection}

### 2. STRUCTURAL REQUIREMENTS (STRICT JSON)
Output **ONLY** valid JSON. No markdown code blocks, no intro text.
The JSON must follow this specific schema:

{
  "part1": [
    // ${config.part1Count} discrete Multiple Choice Questions (Grammar & Vocabulary).
    // Focus: Sentence-level gaps or synonym/antonym checks.
    { 
      "id": 1, 
      "question": "Question sentence...", 
      "options": ["A", "B", "C", "D"], 
      "answer": "Correct Option Content", 
      "explanation": "Explanation in ${lang === 'vi' ? 'Vietnamese' : 'English'}." 
    }
  ],
  "part2": {
    // CLOZE TEST (Fill-in-the-blanks)
    // Instruction: Write a high-quality article (200-300 words) based on the Theme.
    // Insert ${config.part2Count} gaps marked exactly as [1], [2], etc.
    "passage": "The text with [1] markers...",
    "blanks": [
      { "id": 1, "options": ["Option A", "Option B", "Option C", "Option D"], "answer": "Correct Option" }
    ]
  },
  "part3": {
    // READING COMPREHENSION
    // Instruction: Use the **SAME** text from Part 2, but provide the **FULL, COMPLETED** version here (no blanks).
    // The user will read the full text to answer these comprehension questions.
    "passage": "The same text as Part 2, but complete and readable...",
    "questions": [
      // Create exactly 5 questions testing Main Idea, Specific Details, Inference, and Vocabulary in Context.
      { 
        "id": 1, 
        "question": "Question...", 
        "options": ["A", "B", "C", "D"], 
        "answer": "Correct Option", 
        "explanation": "Reference the text to explain why (${lang === 'vi' ? 'in Vietnamese' : 'in English'})." 
      }
    ]
  }
}`;
};

export const calculateScore = (data: TestData, answers: any) => {
  let correct = 0;
  let total = 0;

  // Part 1
  if (data.part1) {
    data.part1.forEach(q => {
        total++;
        if (answers.part1[q.id] === q.answer) correct++;
    });
  }

  // Part 2
  if (data.part2 && data.part2.blanks) {
    data.part2.blanks.forEach(b => {
        total++;
        if (answers.part2[b.id] === b.answer) correct++;
    });
  }

  // Part 3
  if (data.part3 && data.part3.questions) {
    data.part3.questions.forEach(q => {
        total++;
        if (answers.part3[q.id] === q.answer) correct++;
    });
  }

  return { correct, total, percentage: total === 0 ? 0 : Math.round((correct / total) * 100) };
};

export const cleanJsonInput = (input: string): string => {
  let cleaned = input.trim();
  // Remove markdown code blocks if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
};

// SAMPLE_TESTS updated with English content but we keep them as fallback. 
// Ideally, we would have Vietnamese samples too, but for now we keep the structure valid.
export const SAMPLE_TESTS = [
  {
    title: "A2: My Daily Routine",
    content: JSON.stringify({
      "part1": [
        { "id": 1, "question": "I ___ up at 7:00 AM every day.", "options": ["get", "getting", "got", "gets"], "answer": "get", "explanation": "Present Simple for routines with 'I'." },
        { "id": 2, "question": "She ___ breakfast right now.", "options": ["eats", "is eating", "ate", "eaten"], "answer": "is eating", "explanation": "Present Continuous for actions happening now." },
        { "id": 3, "question": "We usually go to the park ___ Sundays.", "options": ["in", "at", "on", "to"], "answer": "on", "explanation": "We use 'on' with days of the week." }
      ],
      "part2": {
        "passage": "My name is Sarah and I am a student. Every morning, I [1] my alarm clock at 6:30. I have a shower and then I eat toast for breakfast. I usually drink orange [2]. I take the bus to university because it is cheap and [3]. My classes start at 9:00.",
        "blanks": [
          { "id": 1, "options": ["hear", "listen", "sound", "play"], "answer": "hear" },
          { "id": 2, "options": ["juice", "soup", "pie", "salad"], "answer": "juice" },
          { "id": 3, "options": ["fast", "slow", "hard", "heavy"], "answer": "fast" }
        ]
      },
      "part3": {
        "passage": "My name is Sarah and I am a student. Every morning, I hear my alarm clock at 6:30. I have a shower and then I eat toast for breakfast. I usually drink orange juice. I take the bus to university because it is cheap and fast. My classes start at 9:00. I study Biology and I love it. After university, I meet my friends or do my homework.",
        "questions": [
          { "id": 1, "question": "What time does Sarah wake up?", "options": ["6:00", "6:30", "7:00", "9:00"], "answer": "6:30", "explanation": "The text says 'I hear my alarm clock at 6:30'." },
          { "id": 2, "question": "What does she eat for breakfast?", "options": ["Eggs", "Cereal", "Toast", "Fruit"], "answer": "Toast", "explanation": "She says 'I eat toast for breakfast'." },
          { "id": 3, "question": "Why does she take the bus?", "options": ["It is cheap and fast", "It is comfortable", "She has no car", "It is slow"], "answer": "It is cheap and fast", "explanation": "Text: 'because it is cheap and fast'." },
          { "id": 4, "question": "What does Sarah study?", "options": ["History", "Math", "Biology", "Art"], "answer": "Biology", "explanation": "She says 'I study Biology'." },
          { "id": 5, "question": "What does she do after university?", "options": ["Sleeps", "Meets friends", "Cooks dinner", "Watches TV"], "answer": "Meets friends", "explanation": "Text: 'I meet my friends or do my homework'." }
        ]
      }
    }, null, 2)
  },
  // Kept other samples for brevity...
];