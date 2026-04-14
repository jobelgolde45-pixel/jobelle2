interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={`
        flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-cyan-100
        font-bold text-blue-700 dark:from-blue-900 dark:to-slate-800 dark:text-blue-200
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
