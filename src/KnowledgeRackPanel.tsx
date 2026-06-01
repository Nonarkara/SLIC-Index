import { useEffect, useMemo, useState } from "react";
import { pickLocale, type LocalizedRecord } from "./i18n";
import type { KnowledgeRackChunk, KnowledgeRackDocument, Locale } from "./types";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const rackUiCopy: LocalizedRecord<{
    eyebrow: string;
    title: string;
    summary: string;
    promptLabel: string;
    placeholder: string;
    ask: string;
    loading: string;
    retrievalNote: string;
    documents: string;
    passages: string;
    examples: string;
    noResults: string;
    resultLabel: string;
    excerpt: string;
    sourceType: string;
    pages: string;
    chunks: string;
    searchExamples: string[];
}> = {
  en: {
    eyebrow: "Knowledge rack",
    title: "Ask the indexed source library",
    summary:
      "This retrieval layer lets readers interrogate the actual source rack behind the methodology. It is evidence-first: the page returns the strongest passages from the indexed library rather than inventing an answer without a source.",
    promptLabel: "Question to the rack",
    placeholder: "Ask about citizen-centric development, ASEAN smart cities, Thailand programmes, mobility, or governance.",
    ask: "Search the rack",
    loading: "Loading indexed passages…",
    retrievalNote: "Retrieval preview. A later model layer can synthesize from these same cited passages.",
    documents: "Documents indexed",
    passages: "Passages indexed",
    examples: "Try one of these prompts",
    noResults: "No strong matches yet. Try a more specific question or a key phrase from the source documents.",
    resultLabel: "Matched passage",
    excerpt: "Excerpt",
    sourceType: "Type",
    pages: "Pages",
    chunks: "Chunks",
    searchExamples: [
      "What does the Smart City Primer say about citizen-centric development?",
      "How does the Hitachi Review article define Thailand's smart city method?",
      "What do the ASEAN materials say about digital connectivity and sustainable cities?",
    ],
  },
  th: {
    eyebrow: "คลังความรู้",
    title: "ถามคำถามกับแหล่งอ้างอิงที่ถูกจัดทำดัชนีแล้ว",
    summary:
      "ชั้นการสืบค้นนี้เปิดให้ผู้อ่านถามคำถามกับคลังเอกสารจริงที่อยู่เบื้องหลัง methodology โดยตรง หลักการคือ evidence-first: ระบบจะคืนข้อความที่ตรงที่สุดจากเอกสารที่จัดทำดัชนีไว้ ไม่ใช่แต่งคำตอบลอย ๆ โดยไม่มีที่มา",
    promptLabel: "คำถามถึงคลังความรู้",
    placeholder: "ถามเรื่อง citizen-centric development, smart city ในอาเซียน, โครงการของไทย, การเดินทาง หรือธรรมาภิบาล",
    ask: "ค้นในคลัง",
    loading: "กำลังโหลดข้อความที่จัดทำดัชนี…",
    retrievalNote: "นี่คือ retrieval preview ชั้นถัดไปสามารถใช้โมเดลมาสังเคราะห์จากข้อความอ้างอิงชุดเดียวกันนี้ได้",
    documents: "จำนวนเอกสาร",
    passages: "จำนวนข้อความย่อย",
    examples: "ลองใช้คำถามตัวอย่าง",
    noResults: "ยังไม่พบข้อความที่ตรงพอ ลองถามให้เฉพาะเจาะจงขึ้น หรือใช้คำสำคัญจากเอกสารต้นฉบับ",
    resultLabel: "ข้อความที่ตรง",
    excerpt: "ข้อความย่อ",
    sourceType: "ประเภท",
    pages: "หน้า",
    chunks: "ช่วงข้อความ",
    searchExamples: [
      "Smart City Primer พูดถึง citizen-centric development อย่างไร",
      "บทความ Hitachi Review ให้นิยามวิธี smart city ของไทยไว้อย่างไร",
      "เอกสารอาเซียนพูดถึง digital connectivity กับ sustainable cities อย่างไร",
    ],
  },
  zh: {
    eyebrow: "知识架",
    title: "向已索引的资料库提问",
    summary:
      "这一检索层让读者直接查询支撑方法论文的真实资料库。它以证据为先：页面返回的是资料库中最相关的段落，而不是没有来源的空泛回答。",
    promptLabel: "向资料库提问",
    placeholder: "可以询问以市民为中心的发展、东盟智慧城市、泰国项目、交通或治理。",
    ask: "检索资料库",
    loading: "正在加载已索引段落…",
    retrievalNote: "这是检索预览层。下一步可在这些已引用段落之上再接入模型做综合回答。",
    documents: "已索引文档",
    passages: "已索引段落",
    examples: "试试这些问题",
    noResults: "暂时没有足够强的匹配。请尝试更具体的问题或直接使用资料中的关键词。",
    resultLabel: "匹配段落",
    excerpt: "摘录",
    sourceType: "类型",
    pages: "页数",
    chunks: "段落块",
    searchExamples: [
      "Smart City Primer 如何讨论以市民为中心的发展？",
      "Hitachi Review 文章如何定义泰国的智慧城市方法？",
      "东盟资料如何讨论数字连接与可持续城市？",
    ],
  },
  ko: {
    eyebrow: "지식 랙",
    title: "색인된 소스 라이브러리에 질문하기",
    summary: "이 검색 레이어는 독자가 방법론 이면의 실제 소스 랙에 질문할 수 있게 해줍니다. 증거가 우선입니다: 페이지는 출처 없이 답변을 만들어내는 대신 색인된 라이브러리에서 가장 강력한 단락을 반환합니다.",
    promptLabel: "랙에 질문하기",
    placeholder: "시민 중심 발전, 아세안 스마트 시티, 태국 프로그램, 모빌리티 또는 거버넌스에 대해 질문해보세요.",
    ask: "랙 검색",
    loading: "색인된 단락 불러오는 중…",
    retrievalNote: "검색 미리보기입니다. 나중에 모델 레이어가 이 인용된 단락들을 종합하여 답변할 수 있습니다.",
    documents: "색인된 문서",
    passages: "색인된 단락",
    examples: "다음 프롬프트 중 하나를 시도해보세요",
    noResults: "강력한 일치 항목이 아직 없습니다. 더 구체적인 질문을 하거나 소스 문서의 핵심 구문을 시도해보세요.",
    resultLabel: "일치하는 단락",
    excerpt: "발췌",
    sourceType: "유형",
    pages: "페이지",
    chunks: "청크",
    searchExamples: [
      "Smart City Primer에서는 시민 중심 발전에 대해 어떻게 설명하나요?",
      "Hitachi Review 기사에서는 태국의 스마트 시티 방법을 어떻게 정의하나요?",
      "아세안 자료에서는 디지털 연결성과 지속 가능한 도시에 대해 어떻게 설명하나요?",
    ],
  },
  ja: {
    eyebrow: "ナレッジラック",
    title: "インデックスされたソースライブラリに質問する",
    summary: "この検索レイヤーにより、読者は方法論の背後にある実際のソースラックに質問することができます。証拠優先です。ページは、出典なしで答えを作成するのではなく、インデックスされたライブラリから最も関連性の高い段落を返します。",
    promptLabel: "ラックに質問する",
    placeholder: "市民中心の発展、ASEANスマートシティ、タイのプログラム、モビリティ、またはガバナンスについて質問してみてください。",
    ask: "ラックを検索",
    loading: "インデックスされた段落を読み込み中…",
    retrievalNote: "検索プレビューです。後続のモデルレイヤーが、これらの引用された段落を統合して回答することができます。",
    documents: "インデックスされたドキュメント",
    passages: "インデックスされた段落",
    examples: "これらのプロンプトのいずれかを試してください",
    noResults: "まだ強力な一致がありません。より具体的な質問をするか、ソースドキュメントのキーフレーズを試してください。",
    resultLabel: "一致した段落",
    excerpt: "抜粋",
    sourceType: "タイプ",
    pages: "ページ",
    chunks: "チャンク",
    searchExamples: [
      "Smart City Primerでは、市民中心の発展についてどのように説明していますか？",
      "Hitachi Reviewの記事では、タイのスマートシティ手法をどのように定義していますか？",
      "ASEANの資料では、デジタル接続性と持続可能な都市についてどのように説明していますか？",
    ],
  },
};

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9\u0E00-\u0E7F\u4E00-\u9FFF]+/g) ?? [];
}

function expandQuery(question: string): string {
  const lower = question.toLowerCase();
  const expansions: string[] = [];
  const phraseMap: Array<[string, string]> = [
    ["อาเซียน", "asean"],
    ["เมืองอัจฉริยะ", "smart city"],
    ["เมืองอัจฉริยะน่าอยู่", "smart liveable city"],
    ["การเชื่อมต่อดิจิทัล", "digital connectivity"],
    ["ยั่งยืน", "sustainable"],
    ["ธรรมาภิบาล", "governance"],
    ["การเดินทาง", "mobility"],
    ["สิงคโปร์", "singapore"],
    ["ไทย", "thailand"],
    ["东盟", "asean"],
    ["智慧城市", "smart city"],
    ["宜居", "liveable"],
    ["数字连接", "digital connectivity"],
    ["可持续", "sustainable"],
    ["治理", "governance"],
    ["交通", "mobility"],
    ["泰国", "thailand"],
    ["公民", "citizen"],
  ];

  for (const [needle, value] of phraseMap) {
    if (lower.includes(needle.toLowerCase())) {
      expansions.push(value);
    }
  }

  return [question, ...expansions].join(" ");
}

function titleVariants(title: string): string[] {
  const lower = title.toLowerCase().trim();
  const trimmed = lower.replace(/^\[[^\]]+\]\s*/, "").trim();
  return Array.from(new Set([lower, trimmed].filter(Boolean)));
}

function scoreChunks(question: string, chunks: KnowledgeRackChunk[]): Array<KnowledgeRackChunk & { score: number }> {
  const expandedQuery = expandQuery(question);
  const queryLower = expandedQuery.toLowerCase();
  const queryTokens = tokenize(expandedQuery);
  if (!queryTokens.length) {
    return [];
  }

  const docFreq = new Map<string, number>();
  const tokenSets = chunks.map((chunk) => {
    const tokens = tokenize(chunk.text);
    const unique = new Set(tokens);
    unique.forEach((token) => {
      docFreq.set(token, (docFreq.get(token) ?? 0) + 1);
    });
    return tokens;
  });

  const total = Math.max(chunks.length, 1);
  return chunks
    .map((chunk, index) => {
      const counts = new Map<string, number>();
      for (const token of tokenSets[index]) {
        counts.set(token, (counts.get(token) ?? 0) + 1);
      }

      let score = 0;
      for (const token of queryTokens) {
        const count = counts.get(token);
        if (!count) {
          continue;
        }
        const idf = Math.log((1 + total) / (1 + (docFreq.get(token) ?? 0))) + 1;
        score += count * idf;
      }

      const variants = titleVariants(chunk.title);
      if (variants.some((variant) => queryLower.includes(variant) || variant.includes(queryLower))) {
        score += 120;
      } else {
        const titleTokens = new Set(tokenize(chunk.title));
        let titleOverlap = 0;
        for (const token of queryTokens) {
          if (titleTokens.has(token)) {
            titleOverlap += 1;
          }
        }
        score += titleOverlap >= 3 ? 24 : titleOverlap * 3.2;
      }

      return {
        ...chunk,
        score,
      };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score);
}

function truncate(text: string, max = 420): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) {
    return normalized;
  }
  return `${normalized.slice(0, max).trim()}…`;
}

export default function KnowledgeRackPanel({ locale }: { locale: Locale }) {
  const ui = pickLocale(rackUiCopy, locale);
  const [question, setQuestion] = useState(ui.searchExamples[0]);
  const [documents, setDocuments] = useState<KnowledgeRackDocument[]>([]);
  const [chunks, setChunks] = useState<KnowledgeRackChunk[] | null>(null);
  const [results, setResults] = useState<Array<KnowledgeRackChunk & { score: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadManifest() {
      try {
        const response = await fetch(`${BASE}/knowledge-rack/catalog/manifest.json`);
        if (!response.ok) {
          throw new Error(`Manifest request failed: ${response.status}`);
        }
        const manifest = (await response.json()) as KnowledgeRackDocument[];
        if (active) {
          setDocuments(manifest);
        }
      } catch (manifestError) {
        if (active) {
          setError(manifestError instanceof Error ? manifestError.message : "Manifest failed");
        }
      }
    }

    loadManifest();
    return () => {
      active = false;
    };
  }, []);

  const docLookup = useMemo(
    () => new Map(documents.map((document) => [document.doc_id, document])),
    [documents],
  );

  async function ensureChunks(): Promise<KnowledgeRackChunk[]> {
    if (chunks) {
      return chunks;
    }

    const response = await fetch(`${BASE}/knowledge-rack/catalog/chunks.json`);
    if (!response.ok) {
      throw new Error(`Chunk request failed: ${response.status}`);
    }

    const loadedChunks = (await response.json()) as KnowledgeRackChunk[];
    setChunks(loadedChunks);
    return loadedChunks;
  }

  async function runSearch(nextQuestion: string) {
    if (!nextQuestion.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const loadedChunks = await ensureChunks();
      setResults(scoreChunks(nextQuestion, loadedChunks).slice(0, 5));
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSearch(question);
    // We only want the initial seeded query to populate once the panel mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const nextQuestion = pickLocale(rackUiCopy, locale).searchExamples[0];
    setQuestion(nextQuestion);
    runSearch(nextQuestion);
    // Locale changes should reseed the visible prompt and the initial retrieval.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return (
    <section className="paper-section section" id="knowledge-rack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{ui.eyebrow}</p>
          <h2>{ui.title}</h2>
        </div>
        <p className="section-summary">{ui.summary}</p>
      </div>

      <div className="knowledge-rack-summary-grid">
        <article className="paper-card knowledge-rack-metric">
          <p className="panel-label">{ui.documents}</p>
          <strong>{documents.length}</strong>
        </article>
        <article className="paper-card knowledge-rack-metric">
          <p className="panel-label">{ui.passages}</p>
          <strong>{chunks?.length ?? "…"}</strong>
        </article>
        <article className="paper-card knowledge-rack-note">
          <p className="panel-label">{ui.examples}</p>
          <p>{ui.retrievalNote}</p>
        </article>
      </div>

      <div className="knowledge-rack-grid">
        <article className="paper-card knowledge-rack-query-card">
          <p className="panel-label">{ui.promptLabel}</p>
          <form
            className="knowledge-rack-form"
            onSubmit={(event) => {
              event.preventDefault();
              runSearch(question);
            }}
          >
            <textarea
              className="knowledge-rack-input"
              value={question}
              placeholder={ui.placeholder}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
            />
            <button type="submit" className="primary-action" disabled={loading}>
              {loading ? ui.loading : ui.ask}
            </button>
          </form>

          <div className="knowledge-rack-example-list">
            {ui.searchExamples.map((example) => (
              <button
                key={example}
                type="button"
                className="knowledge-rack-chip"
                onClick={() => {
                  setQuestion(example);
                  runSearch(example);
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </article>

        <div className="knowledge-rack-results">
          {error ? <article className="paper-card"><p>{error}</p></article> : null}

          {!error && !results.length && !loading ? (
            <article className="paper-card">
              <p>{ui.noResults}</p>
            </article>
          ) : null}

          {results.map((result) => {
            const document = docLookup.get(result.doc_id);
            return (
              <article className="paper-card knowledge-rack-result-card" key={result.chunk_id}>
                <div className="knowledge-rack-result-head">
                  <div>
                    <p className="panel-label">{ui.resultLabel}</p>
                    <h3>{result.title}</h3>
                  </div>
                  <span className="weight-pill">{result.score.toFixed(1)}</span>
                </div>

                <div className="knowledge-rack-meta">
                  <span>
                    <strong>{ui.sourceType}:</strong> {document?.source_type ?? "—"}
                  </span>
                  <span>
                    <strong>{ui.pages}:</strong> {document?.pages ?? "—"}
                  </span>
                  <span>
                    <strong>{ui.chunks}:</strong> {document?.chunk_count ?? "—"}
                  </span>
                </div>

                <p className="knowledge-rack-excerpt">
                  <strong>{ui.excerpt}:</strong> {truncate(result.text)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
