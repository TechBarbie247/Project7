import React, { useState } from "react";

// Define type for shortened links
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
      setInput(""); // clear input field
      setError(""); // clear error message
    } catch (err) {
      setError("There was an error shortening the URL");
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter URL to shorten"
          required
        />
        <button type="submit">Shorten</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {links.map((link, index) => (
          <li key={index}>
            Original:{" "}
            <a href={link.original} target="_blank" rel="noopener noreferrer">
              {link.original}
            </a>
            <br />
            Shortened:{" "}
            <a href={link.short} target="_blank" rel="noopener noreferrer">
              {link.short}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}