import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "int-science-academy-basic-derived-quantities-game-vite-easy";

const appStyle = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 55%, #fefce8 100%)",
  padding: "10px",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: "#0f172a",
};

const containerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "18px",
  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
  padding: "16px",
};

const darkCardStyle = {
  ...cardStyle,
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  color: "white",
};

const badgeStyle = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  background: "#fef3c7",
  color: "#92400e",
  border: "1px solid rgba(245, 158, 11, 0.25)",
};

const buttonBase = {
  border: "1px solid #cbd5e1",
  borderRadius: "14px",
  padding: "12px 14px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  background: "#ffffff",
  color: "#0f172a",
};

const primaryButton = {
  ...buttonBase,
  background: "#0f172a",
  color: "#ffffff",
  border: "1px solid #0f172a",
};

const selectedButton = {
  ...buttonBase,
  background: "#0f172a",
  color: "#ffffff",
  border: "1px solid #f59e0b",
};

const tabButton = (active) => ({
  ...buttonBase,
  minHeight: "46px",
  flex: 1,
  fontSize: "13px",
  background: active ? "#0f172a" : "#ffffff",
  color: active ? "#ffffff" : "#0f172a",
});

const smallText = { fontSize: "12px", color: "#64748b" };
const sectionTitle = { fontSize: "22px", fontWeight: 800, margin: 0 };

const baseQuantities = [
  { name: "길이", symbol: "m", si: "meter" },
  { name: "질량", symbol: "kg", si: "kilogram" },
  { name: "시간", symbol: "s", si: "second" },
  { name: "전류", symbol: "A", si: "ampere" },
  { name: "온도", symbol: "K", si: "kelvin" },
  { name: "물질의 양", symbol: "mol", si: "mole" },
  { name: "광도", symbol: "cd", si: "candela" },
];

const derivedQuantities = [
  { name: "넓이", expression: "m²", unit: "m²", explanation: "평면의 크기", detail: "A = l × w", altUnits: "없음", answer: ["길이"] },
  { name: "부피", expression: "m³", unit: "m³", explanation: "공간의 크기", detail: "V = l × w × h", altUnits: "없음", answer: ["길이"] },
  { name: "속력", expression: "m / s", unit: "m/s", explanation: "단위 시간 동안 이동한 거리", detail: "v = Δx / Δt", altUnits: "없음", answer: ["길이", "시간"] },
  { name: "가속도", expression: "m / s²", unit: "m/s²", explanation: "단위 시간마다 속력이 변하는 정도", detail: "a = Δv / Δt", altUnits: "없음", answer: ["길이", "시간"] },
  { name: "진동수", expression: "1 / s", unit: "Hz", explanation: "1초 동안 반복되는 횟수", detail: "f = 1 / T", altUnits: "Hz = s⁻¹", answer: ["시간"] },
  { name: "힘", expression: "kg × m / s²", unit: "N", explanation: "물체의 운동 상태를 바꾸는 상호작용", detail: "F = ma", altUnits: "N = kg·m/s²", answer: ["질량", "길이", "시간"] },
  { name: "에너지", expression: "kg × m² / s²", unit: "J", explanation: "일을 할 수 있는 능력", detail: "W = Fd, Ek = 1/2 mv²", altUnits: "J = N·m", answer: ["질량", "길이", "시간"] },
  { name: "일률(=전력)", expression: "kg × m² / s³", unit: "W", explanation: "단위 시간당 전달되거나 소비되는 에너지", detail: "P = W / t = VI", altUnits: "W = J/s = V·A", answer: ["질량", "길이", "시간"] },
  { name: "전하량", expression: "A × s", unit: "C", explanation: "전기의 양", detail: "Q = It", altUnits: "C = A·s", answer: ["전류", "시간"] },
  { name: "전압", expression: "kg × m² / (s³ × A)", unit: "V", explanation: "전하 1 C당 주어지는 에너지", detail: "V = W / Q", altUnits: "V = J/C = W/A", answer: ["질량", "길이", "시간", "전류"] },
  { name: "전기용량", expression: "A² × s⁴ / (kg × m²)", unit: "F", explanation: "전하를 저장하는 능력", detail: "C = Q / V", altUnits: "F = C/V", answer: ["질량", "길이", "시간", "전류"] },
  { name: "전기저항", expression: "kg × m² / (s³ × A²)", unit: "Ω", explanation: "전류의 흐름을 방해하는 정도", detail: "R = V / I", altUnits: "Ω = V/A", answer: ["질량", "길이", "시간", "전류"] },
  { name: "밀도", expression: "kg / m³", unit: "kg/m³", explanation: "단위 부피당 질량", detail: "ρ = m / V", altUnits: "없음", answer: ["질량", "길이"] },
  { name: "몰농도", expression: "mol / m³", unit: "mol/m³", explanation: "단위 부피당 용질의 몰수", detail: "c = n / V", altUnits: "없음", answer: ["물질의 양", "길이"] },
  { name: "압력", expression: "kg / (m × s²)", unit: "Pa", explanation: "단위 면적당 작용하는 힘", detail: "p = F / A", altUnits: "Pa = N/m²", answer: ["질량", "길이", "시간"] },
  { name: "자기선속", expression: "kg × m² / (s² × A)", unit: "Wb", explanation: "어떤 면을 통과하는 자기장의 총량", detail: "Φ = BA cosθ", altUnits: "Wb = V·s = T·m²", answer: ["질량", "길이", "시간", "전류"] },
  { name: "자기장", expression: "kg / (s² × A)", unit: "T", explanation: "자기 작용의 세기를 나타내는 물리량", detail: "B = F / (Iℓ) 또는 Φ / A", altUnits: "T = Wb/m² = N/(A·m)", answer: ["질량", "시간", "전류"] },
  { name: "광휘도", expression: "cd / m²", unit: "cd/m²", explanation: "단위 면적당 특정 방향으로 나가는 빛의 세기", detail: "L = Iv / A", altUnits: "없음", answer: ["광도", "길이"] },
];

const tileChoices = ["m", "m²", "m³", "kg", "s", "s²", "s³", "s⁴", "A", "A²", "mol", "cd", "*", "/", "(", ")"];

const tileGameTargets = [
  { name: "넓이", answer: "m²" },
  { name: "부피", answer: "m³" },
  { name: "속력", answer: "m/s" },
  { name: "가속도", answer: "m/s²" },
  { name: "힘", answer: "kg*m/s²" },
  { name: "에너지", answer: "kg*m²/s²" },
  { name: "일률(=전력)", answer: "kg*m²/s³" },
  { name: "전하량", answer: "A*s" },
  { name: "전압", answer: "kg*m²/(s³*A)" },
  { name: "전기용량", answer: "A²*s⁴/(kg*m²)" },
  { name: "전기저항", answer: "kg*m²/(s³*A²)" },
  { name: "밀도", answer: "kg/m³" },
  { name: "몰농도", answer: "mol/m³" },
  { name: "압력", answer: "kg/(m*s²)" },
  { name: "자기선속", answer: "kg*m²/(s²*A)" },
  { name: "자기장", answer: "kg/(s²*A)" },
  { name: "광휘도", answer: "cd/m²" },
];

const difficultyModes = {
  AB: { label: "A+B", title: "기본 · 확장", description: "이름과 단위를 오가며 맞히기", quizTypes: ["name-to-unit", "unit-to-name"], timeLimit: 15 },
  C: { label: "C", title: "관계식 해석", description: "관계식을 보고 유도량 판별", quizTypes: ["detail-to-name"], timeLimit: 14 },
  D: { label: "D", title: "차원 해석", description: "기본량 단위 표현만 보고 유도량 판별", quizTypes: ["expression-to-name"], timeLimit: 12 },
};

function shuffle(arr) {
  return [...arr]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function arraysEqualAsSets(a, b) {
  return [...a].sort().join("|") === [...b].sort().join("|");
}

function getSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { nickname: "", highScores: [] };
    const parsed = JSON.parse(raw);
    return {
      nickname: typeof parsed.nickname === "string" ? parsed.nickname : "",
      highScores: Array.isArray(parsed.highScores) ? parsed.highScores : [],
    };
  } catch {
    return { nickname: "", highScores: [] };
  }
}

function saveState(nickname, highScores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ nickname, highScores }));
}

function buildPrompt(type, target) {
  switch (type) {
    case "unit-to-name":
      return { label: "단위", value: target.unit, secondaryLabel: "기본량 단위 표현", secondaryValue: target.expression, altLabel: "허용되는 다른 표현", altValue: target.altUnits };
    case "name-to-unit":
      return { label: "유도량", value: target.name, secondaryLabel: "정밀 표현", secondaryValue: target.detail, altLabel: "허용되는 다른 표현", altValue: target.altUnits };
    case "detail-to-name":
      return { label: "관계식/정밀 표현", value: target.detail, secondaryLabel: "설명", secondaryValue: target.explanation, altLabel: "허용되는 다른 표현", altValue: target.altUnits };
    default:
      return { label: "기본량 단위 표현", value: target.expression, secondaryLabel: "단위", secondaryValue: target.unit, altLabel: "허용되는 다른 표현", altValue: target.altUnits };
  }
}

function makeQuizQuestion(modeKey) {
  const mode = difficultyModes[modeKey] ?? difficultyModes.AB;
  const q = pickOne(derivedQuantities);
  const type = pickOne(mode.quizTypes);
  const prompt = buildPrompt(type, q);
  const optionPool = type === "name-to-unit" ? derivedQuantities.map((d) => d.unit) : derivedQuantities.map((d) => d.name);
  const correctOption = type === "name-to-unit" ? q.unit : q.name;
  const distractors = shuffle(optionPool.filter((item) => item !== correctOption)).slice(0, 3);
  const choices = shuffle([correctOption, ...distractors]);
  return { target: q, prompt, choices, correctOption };
}

function makeMatchRound(size = 10) {
  return shuffle(derivedQuantities).slice(0, Math.min(size, derivedQuantities.length));
}

function makeTileRound(size = 8) {
  return shuffle(tileGameTargets).slice(0, Math.min(size, tileGameTargets.length));
}

function normalizeExpression(text) {
  return text.replace(/\s+/g, "").replace(/[×·]/g, "*");
}

function runDataTests() {
  if (baseQuantities.length !== 7) throw new Error("기본량은 7개여야 합니다.");
  if (new Set(baseQuantities.map((item) => item.name)).size !== baseQuantities.length) throw new Error("기본량 이름 중복");
  if (new Set(derivedQuantities.map((item) => item.name)).size !== derivedQuantities.length) throw new Error("유도량 이름 중복");
  Object.keys(difficultyModes).forEach((key) => {
    const sampleQuiz = makeQuizQuestion(key);
    if (sampleQuiz.choices.length !== 4) throw new Error("퀴즈 보기 수 오류");
    if (!sampleQuiz.choices.includes(sampleQuiz.correctOption)) throw new Error("정답 누락");
  });
  const sampleRound = makeMatchRound(10);
  if (sampleRound.length !== 10) throw new Error("조합 게임 문제 수 오류");
  const sampleTileRound = makeTileRound(5);
  if (sampleTileRound.length !== 5) throw new Error("타일 게임 문제 수 오류");
  if (!arraysEqualAsSets(["길이", "시간"], ["시간", "길이"])) throw new Error("집합 비교 오류");
  if (!derivedQuantities.every((item) => Array.isArray(item.answer) && item.answer.length >= 1)) {
    throw new Error("정답 데이터 오류");
  }
  if (!tileGameTargets.every((item) => typeof item.answer === "string" && item.answer.length > 0)) {
    throw new Error("타일 게임 정답 데이터 오류");
  }
}

runDataTests();

function ProgressBar({ value }) {
  return (
    <div style={{ width: "100%", height: 10, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: "#0f172a" }} />
    </div>
  );
}

function AppHeader({ nickname, highScores }) {
  const best = highScores[0]?.score ?? 0;
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={badgeStyle}>INT 과학학원 · 기본량 · 유도량 학습 게임</div>
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2 }}>INT Science Academy</div>
          <div style={{ marginTop: 6, fontSize: 15, fontWeight: 800, color: "#334155" }}>INT 과학학원 게임랩 - 기본량과 유도량</div>
          <div style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>
            닉네임 <strong>{nickname || "미입력"}</strong> · 최고 점수 {best}점
          </div>
        </div>
        <div style={darkCardStyle}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>INT 과학학원 학습 도우미</div>
          <div style={{ marginTop: 6, fontSize: 28, fontWeight: 900, color: "#fde047" }}>SI System</div>
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.92 }}>난이도를 선택한 후 게임 시작!!</div>
        </div>
      </div>
    </div>
  );
}

function StartScreen({ nickname, setNickname, selectedMode, setSelectedMode, onStart, highScores }) {
  return (
    <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      <div style={cardStyle}>
        <div style={smallText}>INT 과학학원 학생용 시작 화면</div>
        <h2 style={{ ...sectionTitle, marginTop: 8 }}>게임 시작</h2>
        <div style={{ marginTop: 14, padding: 12, borderRadius: 14, background: "#fefce8", border: "1px solid #fde68a", fontSize: 13, lineHeight: 1.6 }}>
          클리닉 시작 전 5분 워밍업 또는 자율학습 점검용으로 사용해 보세요.
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>닉네임</div>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 12))}
            placeholder="예: INT_물리왕"
            style={{ width: "100%", boxSizing: "border-box", padding: "13px 14px", borderRadius: 14, border: "1px solid #cbd5e1", fontSize: 16 }}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>난이도 선택</div>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
            {Object.entries(difficultyModes).map(([key, mode]) => {
              const active = key === selectedMode;
              return (
                <button key={key} onClick={() => setSelectedMode(key)} style={active ? selectedButton : buttonBase}>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>{mode.label}</div>
                  <div style={{ marginTop: 6, fontSize: 14 }}>{mode.title}</div>
                  <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5, opacity: active ? 0.9 : 0.7 }}>{mode.description}</div>
                  <div style={{ marginTop: 8, fontSize: 11, opacity: active ? 0.9 : 0.65 }}>제한 시간 {mode.timeLimit}초</div>
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={onStart} style={{ ...primaryButton, width: "100%", marginTop: 18, minHeight: 48, fontSize: 15 }}>
          INT 과학학원 게임 시작
        </button>
      </div>

      <div style={cardStyle}>
        <div style={smallText}>INT 최고 기록</div>
        <h2 style={{ ...sectionTitle, marginTop: 8 }}>랭킹</h2>
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {highScores.length === 0 ? (
            <div style={{ fontSize: 13, color: "#64748b" }}>아직 저장된 기록이 없습니다.</div>
          ) : (
            highScores.slice(0, 5).map((item, idx) => (
              <div key={`${item.nickname}-${item.score}-${idx}`} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{idx + 1}. {item.nickname || "익명"}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>INT 과학학원 · 난이도 {item.mode} · {item.date}</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{item.score}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatPill({ label }) {
  return <div style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid #cbd5e1", fontSize: 12, fontWeight: 700 }}>{label}</div>;
}

function HomeButton({ onHome }) {
  return (
    <button onClick={onHome} style={{ ...buttonBase }}>
      홈으로
    </button>
  );
}

function GameQuiz({ modeKey, onFinish, onHome }) {
  const mode = difficultyModes[modeKey] ?? difficultyModes.AB;
  const maxRounds = 20;
  const [question, setQuestion] = useState(() => makeQuizQuestion(modeKey));
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode.timeLimit);
  const [wrongNotes, setWrongNotes] = useState([]);

  useEffect(() => {
    if (feedback) return;
    if (timeLeft <= 0) {
      setFeedback({ correct: false, answer: question.correctOption, timeout: true });
      setCombo(0);
      setWrongNotes((prev) => [
        ...prev,
        {
          name: question.target.name,
          unit: question.target.unit,
          expression: question.target.expression,
          detail: question.target.detail,
          altUnits: question.target.altUnits,
          reason: "시간 초과",
        },
      ]);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [feedback, timeLeft, question]);

  const progress = ((round - 1) / maxRounds) * 100;

  const handleChoice = (choice) => {
    const correct = choice === question.correctOption;
    if (correct) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore((s) => s + 10 + Math.min(nextCombo * 3, 30) + timeLeft);
    } else {
      setCombo(0);
      setWrongNotes((prev) => [
        ...prev,
        {
          name: question.target.name,
          unit: question.target.unit,
          expression: question.target.expression,
          detail: question.target.detail,
          altUnits: question.target.altUnits,
          reason: `선택: ${choice}`,
        },
      ]);
    }
    setFeedback({ correct, answer: question.correctOption, timeout: false });
  };

  const nextRound = () => {
    if (round >= maxRounds) {
      onFinish({ score, wrongNotes, modeKey, modeLabel: mode.label });
      return;
    }
    setQuestion(makeQuizQuestion(modeKey));
    setRound((r) => r + 1);
    setFeedback(null);
    setTimeLeft(mode.timeLimit);
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={smallText}>INT 과학학원 퀴즈 모드</div>
            <h2 style={{ ...sectionTitle, marginTop: 6 }}>난이도 {mode.label}</h2>
            <div style={{ ...smallText, marginTop: 4 }}>{mode.title}</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <StatPill label={`라운드 ${round}/${maxRounds}`} />
            <StatPill label={`점수 ${score}`} />
            <StatPill label={`콤보 ${combo}`} />
            <StatPill label={`타이머 ${timeLeft}s`} />
            <HomeButton onHome={onHome} />
          </div>
        </div>

        <div style={{ marginTop: 14 }}><ProgressBar value={progress} /></div>

        <div style={{ marginTop: 16, border: "1px solid #e2e8f0", borderRadius: 16, padding: 14, background: combo >= 5 ? "#fffbeb" : "white" }}>
          <div style={smallText}>{question.prompt.label}</div>
          <div style={{ marginTop: 6, fontSize: 24, fontWeight: 900, lineHeight: 1.35, wordBreak: "break-word" }}>{question.prompt.value}</div>
          <div style={{ ...smallText, marginTop: 14 }}>{question.prompt.secondaryLabel}</div>
          <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, wordBreak: "break-word" }}>{question.prompt.secondaryValue}</div>
          <div style={{ ...smallText, marginTop: 14 }}>{question.prompt.altLabel}</div>
          <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, wordBreak: "break-word" }}>{question.prompt.altValue}</div>
          <div style={{ ...smallText, marginTop: 14 }}>개념 설명</div>
          <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6 }}>{question.target.explanation}</div>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          {question.choices.map((choice) => (
            <button key={choice} onClick={() => handleChoice(choice)} disabled={Boolean(feedback)} style={{ ...buttonBase, minHeight: 54, lineHeight: 1.45, wordBreak: "break-word", opacity: feedback ? 0.85 : 1 }}>
              {choice}
            </button>
          ))}
        </div>

        {feedback && (
          <div style={{ marginTop: 14, border: "1px solid #e2e8f0", borderRadius: 16, padding: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>{feedback.correct ? "정답!" : feedback.timeout ? "시간 초과" : "오답"}</div>
            <div style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>정답은 <strong>{feedback.answer}</strong> 입니다.</div>
            <button onClick={nextRound} style={{ ...primaryButton, marginTop: 12 }}>
              {round >= maxRounds ? "결과 보기" : "다음 문제"}
            </button>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={smallText}>오답노트</div>
        <h2 style={{ ...sectionTitle, marginTop: 6 }}>최근 오답</h2>
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {wrongNotes.length === 0 ? (
            <div style={{ fontSize: 13, color: "#64748b" }}>아직 오답이 없습니다.</div>
          ) : (
            wrongNotes.slice(-8).reverse().map((item, idx) => (
              <div key={`${item.name}-${idx}`} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{item.name}</div>
                <div style={{ ...smallText, marginTop: 4 }}>{item.reason}</div>
                <div style={{ marginTop: 8, fontSize: 13 }}>단위: <strong>{item.unit}</strong></div>
                <div style={{ marginTop: 4, fontSize: 13, wordBreak: "break-word" }}>기본량 단위 표현: <strong>{item.expression}</strong></div>
                <div style={{ marginTop: 4, fontSize: 13, wordBreak: "break-word" }}>정밀 표현: <strong>{item.detail}</strong></div>
                <div style={{ marginTop: 4, fontSize: 13, wordBreak: "break-word" }}>허용되는 다른 표현: <strong>{item.altUnits}</strong></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CompositionGame({ onHome }) {
  const [roundSet, setRoundSet] = useState(makeMatchRound(10));
  const [selected, setSelected] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [wrongNotes, setWrongNotes] = useState([]);
  const current = roundSet[currentIndex];

  useEffect(() => {
    if (!current || result !== null) return;
    if (timeLeft <= 0) {
      setResult(false);
      setCombo(0);
      setWrongNotes((prev) => [
        ...prev,
        {
          name: current.name,
          expression: current.expression,
          unit: current.unit,
          detail: current.detail,
          altUnits: current.altUnits,
          answer: current.answer.join(", "),
          reason: "시간 초과",
        },
      ]);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, result, current]);

  const toggle = (name) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((value) => value !== name) : [...prev, name]));
  };

  const submit = () => {
    const correct = arraysEqualAsSets(selected, current.answer);
    if (correct) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore((s) => s + 20 + Math.min(nextCombo * 3, 30) + timeLeft);
    } else {
      setCombo(0);
      setWrongNotes((prev) => [
        ...prev,
        {
          name: current.name,
          expression: current.expression,
          unit: current.unit,
          detail: current.detail,
          altUnits: current.altUnits,
          answer: current.answer.join(", "),
          reason: `선택: ${selected.join(", ") || "없음"}`,
        },
      ]);
    }
    setResult(correct);
  };

  const next = () => {
    if (currentIndex === roundSet.length - 1) {
      setRoundSet(makeMatchRound(12));
      setSelected([]);
      setCurrentIndex(0);
      setScore(0);
      setCombo(0);
      setResult(null);
      setTimeLeft(20);
      setWrongNotes([]);
      return;
    }
    setSelected([]);
    setResult(null);
    setCurrentIndex((i) => i + 1);
    setTimeLeft(20);
  };

  if (!current) return null;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={smallText}>INT 과학학원 조합 게임</div>
            <h2 style={{ ...sectionTitle, marginTop: 6 }}>기본량 조합</h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <StatPill label={`문제 ${currentIndex + 1}/${roundSet.length}`} />
            <StatPill label={`점수 ${score}`} />
            <StatPill label={`콤보 ${combo}`} />
            <StatPill label={`타이머 ${timeLeft}s`} />
            <HomeButton onHome={onHome} />
          </div>
        </div>

        <div style={{ marginTop: 16, border: "1px solid #e2e8f0", borderRadius: 16, padding: 14, background: combo >= 5 ? "#fffbeb" : "white" }}>
          <div style={smallText}>유도량</div>
          <div style={{ marginTop: 6, fontSize: 26, fontWeight: 900, lineHeight: 1.3, wordBreak: "break-word" }}>{current.name}</div>
          <div style={{ ...smallText, marginTop: 14 }}>기본량 단위 표현</div>
          <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700, lineHeight: 1.6, wordBreak: "break-word" }}>{current.expression}</div>
          <div style={{ ...smallText, marginTop: 14 }}>단위</div>
          <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700 }}>{current.unit}</div>
          <div style={{ ...smallText, marginTop: 14 }}>허용되는 다른 표현</div>
          <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, wordBreak: "break-word" }}>{current.altUnits}</div>
          <div style={{ ...smallText, marginTop: 14 }}>정밀 표현</div>
          <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, wordBreak: "break-word" }}>{current.detail}</div>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          {baseQuantities.map((q) => {
            const active = selected.includes(q.name);
            return (
              <button key={q.name} onClick={() => toggle(q.name)} disabled={result !== null} style={active ? selectedButton : buttonBase}>
                {q.name}
              </button>
            );
          })}
        </div>

        {result === null ? (
          <button onClick={submit} disabled={selected.length === 0} style={{ ...primaryButton, marginTop: 14, opacity: selected.length === 0 ? 0.6 : 1 }}>
            정답 확인
          </button>
        ) : (
          <div style={{ marginTop: 14, border: "1px solid #e2e8f0", borderRadius: 16, padding: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>{result ? "정답!" : "오답"}</div>
            <div style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>정답 기본량: <strong>{current.answer.join(", ")}</strong></div>
            <button onClick={next} style={{ ...primaryButton, marginTop: 12 }}>
              {currentIndex === roundSet.length - 1 ? "새 게임 시작" : "다음 문제"}
            </button>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={smallText}>오답노트</div>
        <h2 style={{ ...sectionTitle, marginTop: 6 }}>최근 오답</h2>
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {wrongNotes.length === 0 ? (
            <div style={{ fontSize: 13, color: "#64748b" }}>아직 오답이 없습니다.</div>
          ) : (
            wrongNotes.slice(-8).reverse().map((item, idx) => (
              <div key={`${item.name}-${idx}`} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{item.name}</div>
                <div style={{ ...smallText, marginTop: 4 }}>{item.reason}</div>
                <div style={{ marginTop: 8, fontSize: 13, wordBreak: "break-word" }}>기본량 단위 표현: <strong>{item.expression}</strong></div>
                <div style={{ marginTop: 4, fontSize: 13 }}>단위: <strong>{item.unit}</strong></div>
                <div style={{ marginTop: 4, fontSize: 13, wordBreak: "break-word" }}>허용되는 다른 표현: <strong>{item.altUnits}</strong></div>
                <div style={{ marginTop: 4, fontSize: 13, wordBreak: "break-word" }}>정밀 표현: <strong>{item.detail}</strong></div>
                <div style={{ marginTop: 4, fontSize: 13 }}>정답 기본량: <strong>{item.answer}</strong></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TileAssemblyGame({ onHome }) {
  const [roundSet, setRoundSet] = useState(makeTileRound(8));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [built, setBuilt] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [wrongNotes, setWrongNotes] = useState([]);
  const current = roundSet[currentIndex];

  const builtText = built.join(" ");

  const pushTile = (tile) => {
    if (feedback) return;
    setBuilt((prev) => [...prev, tile]);
  };

  const removeLast = () => {
    if (feedback) return;
    setBuilt((prev) => prev.slice(0, -1));
  };

  const resetBuilt = () => {
    if (feedback) return;
    setBuilt([]);
  };

  const submitBuilt = () => {
    const userAnswer = normalizeExpression(built.join(""));
    const correctAnswer = normalizeExpression(current.answer);
    const correct = userAnswer === correctAnswer;

    if (correct) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore((prev) => prev + 25 + Math.min(nextCombo * 4, 32));
    } else {
      setCombo(0);
      setWrongNotes((prev) => [
        ...prev,
        {
          name: current.name,
          userAnswer: built.length === 0 ? "입력 없음" : built.join(" "),
          answer: current.answer,
        },
      ]);
    }

    setFeedback({ correct, answer: current.answer });
  };

  const nextQuestion = () => {
    if (currentIndex === roundSet.length - 1) {
      setRoundSet(makeTileRound(8));
      setCurrentIndex(0);
      setBuilt([]);
      setFeedback(null);
      setScore(0);
      setCombo(0);
      setWrongNotes([]);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setBuilt([]);
    setFeedback(null);
  };

  if (!current) return null;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={smallText}>INT 과학학원 조합 게임 II</div>
            <h2 style={{ ...sectionTitle, marginTop: 6 }}>단위 조립 게임</h2>
            <div style={{ ...smallText, marginTop: 4 }}>타일을 눌러 유도량의 단위를 직접 만들어 보세요.</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <StatPill label={`문제 ${currentIndex + 1}/${roundSet.length}`} />
            <StatPill label={`점수 ${score}`} />
            <StatPill label={`콤보 ${combo}`} />
            <HomeButton onHome={onHome} />
          </div>
        </div>

        <div style={{ marginTop: 16, border: "1px solid #e2e8f0", borderRadius: 16, padding: 14, background: combo >= 4 ? "#fffbeb" : "white" }}>
          <div style={smallText}>문제</div>
          <div style={{ marginTop: 6, fontSize: 28, fontWeight: 900 }}>{current.name}</div>
          <div style={{ ...smallText, marginTop: 14 }}>조립 중인 단위</div>
          <div style={{ marginTop: 6, minHeight: 58, border: "1px dashed #cbd5e1", borderRadius: 12, padding: 12, fontSize: 22, fontWeight: 800, lineHeight: 1.5, wordBreak: "break-word", background: "#f8fafc" }}>
            {builtText || "여기에 단위가 조립됩니다"}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>예시: m / s² 는 m, /, s² 를 순서대로 눌러 조립</div>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))" }}>
          {tileChoices.map((tile) => (
            <button key={tile} onClick={() => pushTile(tile)} disabled={Boolean(feedback)} style={{ ...buttonBase, minHeight: 52, fontSize: 18 }}>
              {tile}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          <button onClick={removeLast} disabled={built.length === 0 || Boolean(feedback)} style={{ ...buttonBase, opacity: built.length === 0 || feedback ? 0.6 : 1 }}>
            하나 지우기
          </button>
          <button onClick={resetBuilt} disabled={built.length === 0 || Boolean(feedback)} style={{ ...buttonBase, opacity: built.length === 0 || feedback ? 0.6 : 1 }}>
            전체 지우기
          </button>
          <button onClick={submitBuilt} disabled={built.length === 0 || Boolean(feedback)} style={{ ...primaryButton, opacity: built.length === 0 || feedback ? 0.6 : 1 }}>
            완성
          </button>
        </div>

        {feedback && (
          <div style={{ marginTop: 14, border: "1px solid #e2e8f0", borderRadius: 16, padding: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>{feedback.correct ? "정답!" : "오답"}</div>
            <div style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>
              정답 단위는 <strong>{feedback.answer}</strong> 입니다.
            </div>
            <button onClick={nextQuestion} style={{ ...primaryButton, marginTop: 12 }}>
              {currentIndex === roundSet.length - 1 ? "새 게임 시작" : "다음 문제"}
            </button>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={smallText}>오답노트</div>
        <h2 style={{ ...sectionTitle, marginTop: 6 }}>최근 오답</h2>
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {wrongNotes.length === 0 ? (
            <div style={{ fontSize: 13, color: "#64748b" }}>아직 오답이 없습니다.</div>
          ) : (
            wrongNotes.slice(-8).reverse().map((item, idx) => (
              <div key={`${item.name}-${idx}`} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{item.name}</div>
                <div style={{ marginTop: 8, fontSize: 13 }}>내가 조립한 답: <strong>{item.userAnswer}</strong></div>
                <div style={{ marginTop: 4, fontSize: 13 }}>정답: <strong>{item.answer}</strong></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BaseQuantityStudy() {
  return (
    <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
      {baseQuantities.map((q) => (
        <div key={q.name} style={cardStyle}>
          <div style={smallText}>기본량 · {q.si}</div>
          <div style={{ marginTop: 8, fontSize: 22, fontWeight: 900 }}>{q.name}</div>
          <div style={{ marginTop: 14, fontSize: 12, color: "#64748b" }}>기본 단위</div>
          <div style={{ marginTop: 6, fontSize: 30, fontWeight: 900 }}>{q.symbol}</div>
        </div>
      ))}
    </div>
  );
}

function FlashChallenge() {
  const [text, setText] = useState("");
  const normalized = text.trim().replace(/\s+/g, "").toLowerCase();

  const result = useMemo(() => {
    if (!normalized) return null;
    const candidates = [
      { keys: ["m", "meter", "길이"], label: "길이" },
      { keys: ["kg", "kilogram", "질량"], label: "질량" },
      { keys: ["s", "second", "시간"], label: "시간" },
      { keys: ["a", "ampere", "전류"], label: "전류" },
      { keys: ["k", "kelvin", "온도"], label: "온도" },
      { keys: ["mol", "mole", "물질의양"], label: "물질의 양" },
      { keys: ["cd", "candela", "광도"], label: "광도" },
    ];
    const found = candidates.find((candidate) => candidate.keys.includes(normalized));
    return found ? found.label : "없음";
  }, [normalized]);

  return (
    <div style={cardStyle}>
      <div style={smallText}>INT 보너스</div>
      <h2 style={{ ...sectionTitle, marginTop: 6 }}>초간단 플래시 확인</h2>
      <div style={{ marginTop: 10, fontSize: 13, color: "#475569" }}>기호나 이름을 입력해 보세요. 기본량인지 빠르게 확인할 수 있어요.</div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="예: m, kg, 시간, candela"
        style={{ width: "100%", boxSizing: "border-box", marginTop: 14, padding: "13px 14px", borderRadius: 14, border: "1px solid #cbd5e1", fontSize: 16 }}
      />
      <div style={{ marginTop: 14, border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
        <div style={smallText}>판정</div>
        <div style={{ marginTop: 6, fontSize: 24, fontWeight: 900, wordBreak: "break-word" }}>
          {result === null ? "입력 대기 중" : result === "없음" ? "기본량 목록에 없음" : `${result} (기본량)`}
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ nickname, result, onRestart, onBackToStart, ranking }) {
  return (
    <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      <div style={cardStyle}>
        <div style={smallText}>INT 과학학원 결과 화면</div>
        <h2 style={{ ...sectionTitle, marginTop: 6 }}>{nickname || "플레이어"}의 결과</h2>
        <div style={{ ...darkCardStyle, marginTop: 14 }}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>INT 과학학원 최종 점수</div>
          <div style={{ marginTop: 6, fontSize: 44, fontWeight: 900, color: "#fde047" }}>{result.score}</div>
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.92 }}>난이도 {result.modeLabel} · 오답 {result.wrongNotes.length}개</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          <button onClick={onRestart} style={primaryButton}>같은 난이도로 다시</button>
          <button onClick={onBackToStart} style={buttonBase}>시작 화면으로</button>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={smallText}>INT 랭킹 느낌</div>
        <h2 style={{ ...sectionTitle, marginTop: 6 }}>최고 기록</h2>
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {ranking.length === 0 ? (
            <div style={{ fontSize: 13, color: "#64748b" }}>기록이 없습니다.</div>
          ) : (
            ranking.slice(0, 7).map((item, idx) => (
              <div key={`${item.nickname}-${item.score}-${idx}`} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{idx + 1}. {item.nickname || "익명"}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>INT 과학학원 · 난이도 {item.mode} · {item.date}</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{item.score}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FooterSummary() {
  return (
    <div style={cardStyle}>
      <div style={smallText}>INT 과학학원 현재 포함 기능</div>
      <div style={{ marginTop: 6, fontSize: 18, fontWeight: 800 }}>학생용 웹앱 프로토타입</div>
      <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.7, color: "#475569" }}>
        시작 화면, 닉네임 입력, 난이도 선택(A+B / C / D), 점수 저장, 결과 화면, 최고기록, 퀴즈 타이머,
        콤보 효과, 오답노트, 기본량 조합 게임 I·II까지 포함되어 있습니다.
      </div>
    </div>
  );
}

export default function BasicDerivedQuantitiesGame() {
  const saved = getSavedState();
  const [nickname, setNickname] = useState(saved.nickname);
  const [highScores, setHighScores] = useState(saved.highScores);
  const [selectedMode, setSelectedMode] = useState("AB");
  const [screen, setScreen] = useState("start");
  const [lastResult, setLastResult] = useState(null);
  const [tab, setTab] = useState("game");

  useEffect(() => {
    saveState(nickname, highScores);
  }, [nickname, highScores]);

  const goHome = () => {
    setTab("game");
    setScreen("start");
  };

  const handleStart = () => setScreen("quiz");

  const handleFinishQuiz = (result) => {
    const date = new Date().toLocaleDateString("ko-KR");
    const entry = { nickname: nickname || "익명", score: result.score, mode: result.modeLabel, date };
    const nextScores = [...highScores, entry].sort((a, b) => b.score - a.score).slice(0, 20);
    setHighScores(nextScores);
    setLastResult(result);
    setScreen("result");
  };

  return (
    <div style={appStyle}>
      <div style={containerStyle}>
        <AppHeader nickname={nickname} highScores={highScores} />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button style={tabButton(tab === "game")} onClick={() => setTab("game")}>메인 게임</button>
          <button style={tabButton(tab === "compose")} onClick={() => setTab("compose")}>조합 게임</button>
          <button style={tabButton(tab === "compose2")} onClick={() => setTab("compose2")}>조합 게임 II</button>
          <button style={tabButton(tab === "study")} onClick={() => setTab("study")}>기본량 보기</button>
          <button style={tabButton(tab === "flash")} onClick={() => setTab("flash")}>플래시 확인</button>
        </div>

        {tab === "game" && screen === "start" && (
          <StartScreen
            nickname={nickname}
            setNickname={setNickname}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            onStart={handleStart}
            highScores={highScores}
          />
        )}

        {tab === "game" && screen === "quiz" && (
          <GameQuiz key={`quiz-${selectedMode}-${screen}`} modeKey={selectedMode} onFinish={handleFinishQuiz} onHome={goHome} />
        )}

        {tab === "game" && screen === "result" && lastResult && (
          <ResultScreen
            nickname={nickname}
            result={lastResult}
            ranking={highScores}
            onRestart={() => setScreen("quiz")}
            onBackToStart={() => setScreen("start")}
          />
        )}

        {tab === "compose" && <CompositionGame onHome={goHome} />}
        {tab === "compose2" && <TileAssemblyGame onHome={goHome} />}
        {tab === "study" && <BaseQuantityStudy />}
        {tab === "flash" && <FlashChallenge />}

        <FooterSummary />
      </div>
    </div>
  );
}
