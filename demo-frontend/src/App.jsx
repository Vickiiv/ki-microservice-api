import { useState } from "react";

const services = [
  {
    id: "summarize",
    tabLabel: "Zusammenfassen",
    heading: "Text zusammenfassen",
    description: "Ein längerer Text rein, eine Kurzfassung raus.",
    placeholder: "Füge hier einen längeren Text ein …",
    buttonLabel: "Zusammenfassen",
    outputType: "text",
    endpoint: "http://localhost:3001/summarize",
    parseResult: (data) => data.summary,
  },
  {
    id: "tags",
    tabLabel: "Tags vorschlagen",
    heading: "Passende Tags finden",
    description: "Ein Text rein, vorgeschlagene Schlagwörter raus.",
    placeholder: "Füge hier einen Text ein …",
    buttonLabel: "Tags vorschlagen",
    outputType: "tags",
    endpoint: "http://localhost:3001/suggest-tags",
    parseResult: (data) => data.tags,
  },
];

export default function App() {
  const [activeId, setActiveId] = useState(services[0].id);
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const active = services.find((s) => s.id === activeId);
  const output = results[activeId];

  const handleRun = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(active.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Etwas ist schiefgelaufen.");
      }
      const data = await res.json();
      setResults((prev) => ({ ...prev, [activeId]: active.parseResult(data) }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cloud flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="blob absolute w-96 h-96 bg-glow rounded-full blur-3xl opacity-25 -top-20 -left-20" />
      <div className="blob-delay absolute w-80 h-80 bg-violet rounded-full blur-3xl opacity-20 bottom-0 right-0" />

      <div className="w-full max-w-xl relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-violet" />
          <span className="text-sm text-mist">läuft lokal über Ollama</span>
        </div>

        <h1 className="font-display italic text-4xl text-ink mb-6">
          KI-Werkzeugkasten
        </h1>

        <div className="bg-card border border-lilac rounded-2xl overflow-hidden">
          <div className="flex border-b border-lilac">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  s.id === activeId
                    ? "bg-violet text-white"
                    : "text-mist hover:text-ink"
                }`}
              >
                {s.tabLabel}
              </button>
            ))}
          </div>

          <div className="p-6">
            <h2 className="text-lg text-ink mb-1">{active.heading}</h2>
            <p className="text-sm text-mist mb-4">{active.description}</p>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={active.placeholder}
              rows={12}
              className="w-full bg-cloud border border-lilac rounded-lg px-3 py-2 text-sm text-ink placeholder:text-mist focus:outline-none focus:border-violet mb-3"
            />

            <button
              onClick={handleRun}
              disabled={!inputText.trim() || loading}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:bg-lilac disabled:text-mist disabled:cursor-not-allowed bg-violet text-white hover:brightness-110"
            >
              {loading ? "Wird verarbeitet …" : active.buttonLabel}
            </button>

            {error && !loading && (
              <p className="text-sm text-red-400 mt-3">{error}</p>
            )}

            {output && !loading && (
              <div className="mt-5 pt-5 border-t border-lilac">
                <div className="text-xs text-mist mb-2">{active.tabLabel}</div>
                {active.outputType === "text" && (
                  <p className="text-sm leading-relaxed text-ink">{output}</p>
                )}
                {active.outputType === "tags" && (
                  <div className="flex flex-wrap gap-2">
                    {output.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-lilac text-violet rounded-full px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
