import { useEffect, useState } from "react";

type UrlEntry = {
    originalUrl: string;
    shortenedUrl: string;
};

export default function UrlList() {
    const currentProtocol: string = window.location.protocol;
    const currentHostname: string = window.location.hostname;
    const [urls, setUrls] = useState<UrlEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/list`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch URLs");
                return res.json();
            })
            .then(setUrls)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div
            style={{
                marginTop: 32,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(44,62,80,0.07)",
                padding: "1.5rem 2rem",
                maxWidth: 600,
                width: "100%",
            }}
        >
            <h3 style={{ color: "#764ba2", marginBottom: 16, fontWeight: 700 }}>
                Your Shortened URLs
            </h3>
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: "#e53e3e" }}>{error}</div>}
            {!loading && !error && urls.length === 0 && (
                <div style={{ color: "#888" }}>No URLs found.</div>
            )}
            {!loading && !error && urls.length > 0 && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f3f0fa" }}>
                            <th style={{ textAlign: "left", padding: "8px" }}>Original URL</th>
                            <th style={{ textAlign: "left", padding: "8px" }}>Shortened URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {urls.map((url, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "8px", wordBreak: "break-all" }}>
                                    <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                                        {url.originalUrl}
                                    </a>
                                </td>
                                <td style={{ padding: "8px", wordBreak: "break-all" }}>
                                    <a href={`/${url.shortenedUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: "#667eea" }}>
                                        {currentProtocol + "//" + currentHostname + "/" + url.shortenedUrl}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}