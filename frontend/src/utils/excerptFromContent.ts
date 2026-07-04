export const getExcerpt = (content: string, length: number = 100): string => {
    if (!content) return "";
    if (content.length <= length) return content;
    return content.slice(0, length).trim() + "...";
};
