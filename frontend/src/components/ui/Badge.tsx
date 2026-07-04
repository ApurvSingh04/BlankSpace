export const Badge = ({ text, color = "gray" }: { text: string, color?: "gray" | "green" | "blue" }) => {
    const colors = {
        gray: "bg-gray-100 text-gray-800",
        green: "bg-green-100 text-green-800",
        blue: "bg-blue-100 text-blue-800",
    };

    return (
        <span className={`${colors[color]} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
            {text}
        </span>
    );
};
