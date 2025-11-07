import { NextApiRequest, NextApiResponse } from "next";

export default async function getLanguages(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const response = await fetch(
      "https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry"
    );
    const text = await response.text();

    // جدا کردن بخش‌ها با %%
    const blocks = text.split("%%");

    const languages = blocks
      .map((block) => {
        const typeMatch = block.match(/Type:\s*(\w+)/);
        if (!typeMatch || typeMatch[1] !== "language") return null; // فقط نوع زبان‌ها

        const subtagMatch = block.match(/Subtag:\s*(\w+)/);
        const descriptionMatches = [...block.matchAll(/Description:\s*(.+)/g)].map(
          (d) => d[1]
        );
        const addedMatch = block.match(/Added:\s*([0-9-]+)/);
        const suppressScriptMatch = block.match(/Suppress-Script:\s*(\w+)/);
        const scopeMatch = block.match(/Scope:\s*(\w+)/);
        const macrolanguageMatch = block.match(/Macrolanguage:\s*(\w+)/);

        return {
          type: "language",
          subtag: subtagMatch ? subtagMatch[1] : null,
          description: descriptionMatches.length ? descriptionMatches : null,
          added: addedMatch ? addedMatch[1] : null,
          suppressScript: suppressScriptMatch ? suppressScriptMatch[1] : null,
          scope: scopeMatch ? scopeMatch[1] : null,
          macrolanguage: macrolanguageMatch ? macrolanguageMatch[1] : null,
        };
      })
      .filter((lang) => lang && lang.subtag) // حذف nullها
      .sort((a, b) =>
        (a?.description?.[0] || "").localeCompare(b?.description?.[0] || "")
      );

    res.status(200).json(languages);
  } catch (error) {
    console.error("Error fetching IANA:", error);
    res.status(500).json({ message: "Error fetching languages" });
  }
}
