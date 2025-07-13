export const highlightQuery = (text: string | undefined, query: string) => {
    if (!query || !text) return text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
  
    if (index === -1) return text;
  
    return (
      <>
        {text.slice(0, index)}
        <span className="bg-teal-200">{text.slice(index, index + lowerQuery.length)}</span>
        {text.slice(index + lowerQuery.length)}
      </>
    );
};

export const getEmbedUrl = (url: string): string => {
  if (url.includes('/embed/')) return url;

  const videoIdMatch = url.match(/(?:v=|\/shorts\/|\.be\/)([\w-]{11})/);
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : '';
};