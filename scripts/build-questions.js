import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workbook = XLSX.readFile(path.join(__dirname, '..', 'NEW.xlsx'));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(sheet);

const questions = rawData.map((row) => ({
  id: row['ID Soal'],
  difficulty: row['Tingkat Kesulitan'],
  question: row['Pertanyaan'],
  options: {
    A: row['Pilihan A'],
    B: row['Pilihan B'],
    C: row['Pilihan C'],
    D: row['Pilihan D'],
  },
  answer: row['Kunci Jawaban'],
  explanation: row['Pembahasan Singkat'],
  image: row['Gambar Soal'] || null,
}));

const outputDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const output = `// Auto-generated from BANKSOALGU.xlsx — do not edit manually
const QUESTIONS = ${JSON.stringify(questions, null, 2)};

export default QUESTIONS;
`;

fs.writeFileSync(path.join(outputDir, 'questions.js'), output, 'utf-8');
console.log(`Generated ${questions.length} questions to src/data/questions.js`);
