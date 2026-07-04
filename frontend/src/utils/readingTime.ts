export const calculateReadingTime = (content: string): number => {
    if (!content) return 1;
    // Assuming 200 words per minute average reading speed
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / 150);
};
