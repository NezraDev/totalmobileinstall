const EMAIL = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/;

// Owner-supplied legal text is rendered as written; only email addresses become links.
function withEmailLinks(text) {
  return text.split(EMAIL).map((part, index) =>
    index % 2 ? (
      <a key={part + index} href={`mailto:${part}`}>
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export default function LegalDocument({ sections }) {
  return sections.map((section) => {
    const Heading = section.level === 3 ? 'h3' : 'h2';
    return (
      <section key={section.heading}>
        <Heading>{section.heading}</Heading>
        {section.paragraphs?.map((paragraph) => (
          <p key={paragraph}>{withEmailLinks(paragraph)}</p>
        ))}
        {section.list && (
          <ul>
            {section.list.map((item) => (
              <li key={item}>{withEmailLinks(item)}</li>
            ))}
          </ul>
        )}
        {section.afterList?.map((paragraph) => (
          <p key={paragraph}>{withEmailLinks(paragraph)}</p>
        ))}
      </section>
    );
  });
}
