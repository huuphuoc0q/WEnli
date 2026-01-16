import { CEFRLevel, Language } from "./types";

export const LEVELS: { id: CEFRLevel; label: string; descEn: string; descVi: string }[] = [
  { id: 'A1', label: 'Beginner', descEn: 'Basic everyday phrases', descVi: 'Cụm từ cơ bản hàng ngày' },
  { id: 'A2', label: 'Elementary', descEn: 'Simple communication', descVi: 'Giao tiếp đơn giản' },
  { id: 'B1', label: 'Intermediate', descEn: 'Work, school, travel', descVi: 'Công việc, học tập, du lịch' },
  { id: 'B2', label: 'Upper Int.', descEn: 'Fluent & spontaneous', descVi: 'Trôi chảy & tự nhiên' },
  { id: 'C1', label: 'Advanced', descEn: 'Complex tasks & social', descVi: 'Tác vụ phức tạp & xã hội' },
  { id: 'C2', label: 'Mastery', descEn: 'Near-native proficiency', descVi: 'Gần như người bản xứ' },
];

export const GRAMMAR_CATEGORIES = [
  {
    category: "12 Tenses",
    labelVi: "12 Thì trong tiếng Anh",
    // topics: [
    //   "Present Simple", "Present Continuous", "Present Perfect", "Present Perfect Continuous",
    //   "Past Simple", "Past Continuous", "Past Perfect", "Past Perfect Continuous",
    //   "Future Simple", "Near Future (Be going to)", "Future Continuous", "Future Perfect", "Future Perfect Continuous"
    // ]
    topics: [
      "Hiện tại đơn", "Hiện tại tiếp diễn", "Hiện tại hoàn thành", "Hiện tại hoàn thành tiếp diễn",
      "Quá khứ đơn", "Quá khứ tiếp diễn", "Quá khứ hoàn thành", "Quá khứ hoàn thành tiếp diễn",
      "Tương lai đơn", "Tương lai gần (Be going to)", "Tương lai tiếp diễn", "Tương lai hoàn thành", "Tương lai hoàn thành tiếp diễn"
    ]
  },
  {
    category: "Parts of Speech",
    labelVi: "Từ loại",
    topics: [
      "Danh từ (Đếm được/Không đếm được)", "Danh từ (Số ít/Số nhiều)", "Danh từ ghép", "Sở hữu cách",
      "Đại từ nhân xưng & Đại từ tân ngữ", "Đại từ sở hữu & Đại từ phản thân", "Đại từ chỉ định & Đại từ bất định",
      "Vị trí & Trật tự tính từ", "Tính từ đuôi -ing/-ed",
      "Trạng từ (Tần suất, Nơi chốn, Thời gian, Mức độ)",
      "Ngoại động từ & Nội động từ", "Liên động từ", "Động từ bất quy tắc",
      "Mạo từ (A/An/The/Không dùng mạo từ)",
      "Giới từ (Thời gian, Nơi chốn, Chuyển động)", "Cụm giới từ",
      "Liên từ (Kết hợp - FANBOYS, Phụ thuộc, Tương quan)"
    ]
  },
  {
    category: "Sentence Structure",
    labelVi: "Cấu trúc câu",
    topics: [
      "Sự hòa hợp giữa chủ ngữ và động từ",
      "Câu bị động (cơ bản)",
      "Bị động vô nhân xưng",
      "Cấu trúc sai khiến (Have/Get + quá khứ phân từ)",
      "Câu tường thuật",
      "Câu điều kiện (loại 0, 1, 2, 3)",
      "Câu điều kiện hỗn hợp",
      "Đảo ngữ trong câu điều kiện",
      "Mệnh đề quan hệ",
      "Mệnh đề quan hệ rút gọn",
      "Danh động từ (V-ing)",
      "Động từ nguyên mẫu có 'to' (To V)",
      "Động từ nguyên mẫu không 'to' (Bare Infinitive)"
    ]
  },
  {
    category: "Modal Verbs",
    labelVi: "Động từ khuyết thiếu",
    topics: [
      "Động từ khuyết thiếu cơ bản (Can/Could/Must...)", 
      "Động từ bán khuyết thiếu (Have to/Ought to)", 
      "Động từ khuyết thiếu chỉ sự suy luận", 
      "Động từ khuyết thiếu ở dạng hoàn thành (Should have V3...)"
    ]
  },
  {
    category: "Advanced & Others",
    labelVi: "Nâng cao & Khác",
    topics: [
      "So sánh (Bằng/Hơn/Nhất)", "So sánh kép",
      "Câu giả định (Wish/If only/Would rather)", "Đảo ngữ (Tổng quát)", "Câu chẻ",
      "Câu hỏi đuôi", "Cụm động từ", "Cụm từ cố định & Thành ngữ"
    ]
  }
];

export const INITIAL_CONFIG = {
  level: 'B1' as CEFRLevel,
  grammarTopics: [],
  vocabulary: '',
  part1Count: 5,
  part2Count: 5,
};

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    landing: {
      tag: "AI-Powered English Learning",
      title1: "Practice English",
      title2: "On Your Terms",
      desc: "A flexible tool to generate custom practice tests. Configure your level, copy the prompt, use any AI model, and practice instantly.",
      step1: "Configure",
      step1_desc: "Select your level, grammar topics, and vocabulary focus.",
      step2: "Generate",
      step2_desc: "Copy our smart prompt to Claude, ChatGPT, or Gemini.",
      step3: "Practice",
      step3_desc: "Paste the result back here and take an interactive test.",
      cta: "Start Creating Test"
    },
    config: {
      title: "Configure Your Test",
      subtitle: "Customize the difficulty and content to match your learning goals.",
      level_label: "1. Select CEFR Level",
      level_tooltip: "Standard European Framework for Languages levels from Beginner (A1) to Master (C2).",
      current: "Current",
      grammar_label: "2. Grammar Focus (Optional)",
      selected: "selected",
      no_topics: "No topics selected. The test will cover random grammar points suitable for",
      vocab_label: "3. Vocabulary (Optional)",
      vocab_desc: "Enter specific words you want to practice (one per line).",
      vocab_placeholder: "e.g.\ninnovation\nsustainable\nresilient",
      structure_label: "4. Structure",
      part1_label: "Part 1 Questions (Grammar MCQ)",
      part2_label: "Part 2 Blanks (Cloze Test)",
      part3_label: "Part 3: Reading Comprehension",
      part3_fixed: "5 questions (Fixed)",
      cta: "Generate Prompt"
    },
    prompt: {
      title: "Your Prompt is Ready",
      subtitle: "Copy this prompt and paste it into ChatGPT, Claude, Gemini, or any other AI.",
      copy: "Copy Prompt",
      copied: "Copied!",
      use_ai: "Use any AI Model",
      use_ai_desc: "Works great with GPT-4, Claude 3.5 Sonnet, or Gemini Pro.",
      next: "Next Step",
      next_desc: "Once the AI gives you the JSON, click below to paste it.",
      btn_back: "Back",
      btn_next: "I Have the JSON"
    },
    json: {
      title: "Test Editor",
      subtitle: "Paste your JSON code here or select a test from the library.",
      import: "Import",
      save: "Save",
      paste: "Paste",
      render: "Render Test",
      library: "Test Library",
      library_empty: "Library is empty.",
      library_tip: "Import or Save a test to see it here.",
      pro_tip: "Pro Tip: Tests are saved in your browser.",
      save_modal_title: "Save Test to Library",
      save_placeholder: "E.g., Business English B2 - Unit 1",
      confirm: "Confirm",
      cancel: "Cancel",
      error_empty: "Please paste the JSON content first.",
      error_invalid: "Invalid JSON"
    },
    practice: {
      part1_title: "Part 1: Grammar & Vocabulary",
      part2_title: "Part 2: Cloze Test",
      part3_title: "Part 3: Reading Comprehension",
      part3_passage: "Passage",
      part3_questions: "Questions",
      select: "Select...",
      prev: "Prev",
      next: "Next",
      finish: "Finish Test"
    },
    results: {
      complete: "Test Complete!",
      score_text: "You got {correct} out of {total} correct",
      review: "Detailed Review",
      save_success: "Saved Successfully!",
      create_another: "Create Another Test"
    },
    steps: {
      config: "Step 1: Configure",
      prompt: "Step 2: Get Prompt",
      json: "Step 3: Paste Code",
      practice: "Practice Mode",
      results: "Results"
    }
  },
  vi: {
    landing: {
      tag: "Học Tiếng Anh Với AI",
      title1: "Luyện Tiếng Anh",
      title2: "Theo Cách Của Bạn",
      desc: "Công cụ linh hoạt để tạo đề thi tùy chỉnh. Chọn cấp độ, sao chép lệnh (prompt), dùng bất kỳ AI nào để tạo đề và luyện tập ngay lập tức.",
      step1: "Cấu hình",
      step1_desc: "Chọn cấp độ, chủ điểm ngữ pháp và từ vựng trọng tâm.",
      step2: "Tạo Prompt",
      step2_desc: "Sao chép lệnh thông minh vào ChatGPT, Claude, hoặc Gemini.",
      step3: "Luyện tập",
      step3_desc: "Dán kết quả JSON vào đây và bắt đầu làm bài.",
      cta: "Bắt đầu tạo đề"
    },
    config: {
      title: "Cấu hình đề thi",
      subtitle: "Tùy chỉnh độ khó và nội dung phù hợp với mục tiêu học tập.",
      level_label: "1. Chọn cấp độ CEFR",
      level_tooltip: "Khung tham chiếu ngôn ngữ chung Châu Âu từ Sơ cấp (A1) đến Thành thạo (C2).",
      current: "Hiện tại",
      grammar_label: "2. Ngữ pháp trọng tâm (Tùy chọn)",
      selected: "đã chọn",
      no_topics: "Chưa chọn chủ đề. Đề thi sẽ bao gồm các điểm ngữ pháp ngẫu nhiên phù hợp với cấp độ",
      vocab_label: "3. Từ vựng (Tùy chọn)",
      vocab_desc: "Nhập các từ cụ thể bạn muốn ôn tập (mỗi từ một dòng).",
      vocab_placeholder: "ví dụ:\ninnovation\nsustainable\nresilient",
      structure_label: "4. Cấu trúc đề thi",
      part1_label: "Phần 1: Trắc nghiệm Ngữ pháp/Từ vựng",
      part2_label: "Phần 2: Điền từ (Cloze Test)",
      part3_label: "Phần 3: Đọc hiểu",
      part3_fixed: "5 câu hỏi (Cố định)",
      cta: "Tạo Prompt"
    },
    prompt: {
      title: "Lệnh (Prompt) đã sẵn sàng",
      subtitle: "Sao chép lệnh này và dán vào ChatGPT, Claude, Gemini hoặc bất kỳ AI nào.",
      copy: "Sao chép",
      copied: "Đã chép!",
      use_ai: "Dùng bất kỳ AI nào",
      use_ai_desc: "Hoạt động tốt với GPT-4, Claude 3.5 Sonnet, hoặc Gemini Pro.",
      next: "Bước tiếp theo",
      next_desc: "Khi AI trả về mã JSON, hãy bấm nút dưới đây để dán vào.",
      btn_back: "Quay lại",
      btn_next: "Tôi đã có JSON"
    },
    json: {
      title: "Trình soạn thảo",
      subtitle: "Dán mã JSON vào đây hoặc chọn đề thi từ thư viện.",
      import: "Nhập file",
      save: "Lưu",
      paste: "Dán",
      render: "Tạo bài thi",
      library: "Thư viện đề",
      library_empty: "Thư viện trống.",
      library_tip: "Nhập file hoặc Lưu đề thi để xem tại đây.",
      pro_tip: "Mẹo: Đề thi được lưu trên trình duyệt của bạn.",
      save_modal_title: "Lưu vào thư viện",
      save_placeholder: "Ví dụ: Tiếng Anh Thương Mại B2 - Bài 1",
      confirm: "Xác nhận",
      cancel: "Hủy",
      error_empty: "Vui lòng dán nội dung JSON trước.",
      error_invalid: "JSON không hợp lệ"
    },
    practice: {
      part1_title: "Phần 1: Ngữ pháp & Từ vựng",
      part2_title: "Phần 2: Điền từ vào đoạn văn",
      part3_title: "Phần 3: Đọc hiểu",
      part3_passage: "Bài đọc",
      part3_questions: "Câu hỏi",
      select: "Chọn...",
      prev: "Trước",
      next: "Tiếp",
      finish: "Nộp bài"
    },
    results: {
      complete: "Hoàn thành!",
      score_text: "Bạn làm đúng {correct} trên {total} câu",
      review: "Xem chi tiết",
      save_success: "Đã lưu thành công!",
      create_another: "Tạo đề khác"
    },
    steps: {
      config: "B1: Cấu hình",
      prompt: "B2: Lấy Prompt",
      json: "B3: Dán Code",
      practice: "Làm bài",
      results: "Kết quả"
    }
  }
};