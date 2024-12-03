export const container = {
  base: "bg-white shadow-lg rounded-xl border border-gray-100",
  padding: "p-6",
  spacing: "space-y-4 sm:space-y-6",
  innerSpacing: "space-y-3",
  page: {
    wrapper: "min-h-screen bg-gray-50",
    content: "max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8"
  }
};

export const text = {
  title: "text-xl font-semibold text-gray-900",
  subtitle: "text-base font-medium text-gray-900",
  label: "text-sm font-medium text-gray-500",
  value: "text-base font-medium text-gray-900",
  small: "text-xs text-gray-500"
};

export const colors = {
  primary: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    hover: "hover:border-blue-600"
  },
  secondary: {
    bg: "bg-gray-50",
    text: "text-gray-500",
    border: "border-gray-200",
    hover: "hover:border-gray-400"
  },
  success: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-100"
  },
  warning: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100"
  },
  info: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100"
  },
  error: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100"
  },
  gradient: "bg-gradient-to-r from-blue-500 to-purple-500"
};

export const layout = {
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    start: "flex items-start"
  },
  grid: {
    cols1: "grid grid-cols-1 gap-4",
    cols2: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    cols3: "grid grid-cols-1 sm:grid-cols-3 gap-4",
    cols4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
  }
};

export const icon = {
  small: "h-4 w-4",
  medium: "h-6 w-6",
  large: "h-8 w-8"
};

export const avatar = {
  base: "rounded-full flex items-center justify-center",
  small: "w-8 h-8",
  medium: "w-10 h-10",
  large: "w-12 h-12"
};

export const animation = {
  transition: "transition-all duration-200 ease-in-out",
  scale: "hover:scale-105"
}; 