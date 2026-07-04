export const formatDate = (dateInput?: string | Date): string => {
    if (!dateInput) {
        // Fallback since backend doesn't have createdAt yet
        return new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(new Date());
    }
    
    const date = new Date(dateInput);
    return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(date);
};
