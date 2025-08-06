import React, { useState } from "react";
import "./App.css"; // Make sure this contains your custom styles
import bgImage from "./; // adjust the path if needed

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
      setInput("");
      setError("");
    } catch (err) {
      setError("There was an error shortening the URL");
      console.error(err);
    }
  };

  return (
    <div className="url-shortener-container">
      <div className="shortener-card">
        <form onSubmit={handleSubmit} className="shortener-form">
          <input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a link to shorten"
            required
            className="url-input"
          />
          <button type="submit" className="shorten-button">
            Shorten It!
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
        <ul className="shortened-list">
          {links.map((link, index) => (
            <li key={index} className="shortened-item">
              <span className="original-link">{link.original}</span>
              <a
                className="short-link"
                href={link.short}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.short}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
