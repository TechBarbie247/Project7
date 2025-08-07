import React, { useState } from "react";
type ShortLink = {
  original: string;
  short: string;
};

export default function UrlShortener() {
  const [input, setInput] = useState("");
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [error, setError] = useState("");

  const BITLY_ACCESS_TOKEN = "c2f1b89b96bbbebedb27fd4ccf3bc4e892eb140f";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("https://api-ssl.bitly.com/v4/shorten", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ long_url: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();

      setLinks((prev) => [...prev, { original: input, short: data.link }]);
      setInput(""); // clear input
      setError(""); // clear error
    } catch (err) {
      setError("There was an error shortening the URL");
      console.error(err);
    }
  };

  return (
    <section className="shortener-section">
      <div className="shortener-container">
        <form onSubmit={handleSubmit} className="shortener-form">
          <input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Shorten a link here..."
            required
            className="shortener-input"
          />
          <button type="submit" className="shortener-button">
            Shorten It!
          </button>
        </form>

        {error && <p className="shortener-error">{error}</p>}

        <ul className="shortener-links">
          {links.map((link, index) => (
            <li key={index} className="shortener-link-item">
              <span className="original-link">{link.original}</span>
              <span className="short-link">{link.short}</span>
              <button
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(link.short);
                }}
              >
                Copy
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
