import React, { useState } from "react";

export default function App() {
  const currentProtocol: string = window.location.protocol;
  const currentHostname: string = window.location.hostname;
  const [fullUrl, setFullUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    try {
      const res = await fetch(`/api/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullUrl }),
      });
      if (!res.ok) {
        setError(await res.text());
        return;
      }
      const alias = await res.text();
      setShortUrl(`/${alias}`);
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "900px",
          maxWidth: "98vw",
          minHeight: "600px",
          background: "rgba(255,255,255,0.0)",
          borderRadius: 24,
          boxShadow: "0 8px 32px rgba(44, 62, 80, 0.15)",
          overflow: "hidden",
        }}
      >
        {/* Left: Form */}
        <div
          style={{
            background: "white",
            borderRadius: "24px 0 0 24px",
            padding: "2.5rem 2rem",
            width: 400,
            minWidth: 320,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "#764ba2",
              marginBottom: 24,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            🔗 URL Shortener
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="url"
              value={fullUrl}
              onChange={e => setFullUrl(e.target.value)}
              placeholder="Paste your long URL here…"
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 16,
                marginBottom: 16,
                outline: "none",
                transition: "border 0.2s",
              }}
              onFocus={e => (e.target.style.border = "1.5px solid #764ba2")}
              onBlur={e => (e.target.style.border = "1px solid #d1d5db")}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 8,
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 600,
                fontSize: 16,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(44, 62, 80, 0.08)",
                transition: "background 0.2s",
              }}
            >
              ✂️ Shorten URL
            </button>
          </form>
          {shortUrl && (
            <div
              style={{
                marginTop: 28,
                padding: "1rem",
                borderRadius: 10,
                background: "#f3f0fa",
                border: "1.5px solid #d1c4e9",
                textAlign: "center",
                wordBreak: "break-all",
              }}
            >
              <span style={{ color: "#764ba2", fontWeight: 600 }}>Short URL:</span>
              <br />
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#667eea",
                  fontWeight: 500,
                  fontSize: 18,
                  textDecoration: "none",
                }}
              >
                {currentProtocol + "//" + currentHostname + shortUrl}
              </a>
            </div>
          )}
          {error && (
            <div
              style={{
                marginTop: 20,
                color: "#e53e3e",
                background: "#fff5f5",
                border: "1px solid #fed7d7",
                borderRadius: 8,
                padding: "0.75rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
        </div>
        {/* Right: Logo/Brand */}
        <div
          style={{
            flex: 1,
            background: "#ececec",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "0 24px 24px 0",
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: "4rem",
              fontWeight: 900,
              color: "#b0aeb8",
              letterSpacing: "0.1em",
              userSelect: "none",
              textShadow: "2px 4px 16px #fff, 0 2px 8px #bbb",
              fontFamily: "monospace, Inter, Arial, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            cf.short
          </span>
        </div>
      </div>
    </div>
  );
}