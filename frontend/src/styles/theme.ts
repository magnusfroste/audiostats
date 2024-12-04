export const card = {
  root: "bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden",
  header: "p-6 border-b border-gray-100",
  body: "p-6",
  footer: "p-6 border-t border-gray-100",
  hover: "transition-shadow hover:shadow-2xl",
  grid: "grid grid-cols-1 divide-y divide-gray-100"
};

export const stats = {
  container: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
  item: {
    base: "rounded-2xl p-4 border",
    primary: "bg-blue-50 border-blue-100",
    success: "bg-green-50 border-green-100",
    info: "bg-purple-50 border-purple-100",
    warning: "bg-amber-50 border-amber-100"
  },
  label: "text-sm font-medium text-gray-600",
  value: "text-lg font-semibold text-gray-900 mt-1"
};

export const typography = {
  h1: "text-3xl font-bold text-gray-900",
  h2: "text-2xl font-bold text-gray-900",
  h3: "text-xl font-semibold text-gray-900",
  body: "text-base text-gray-600",
  small: "text-sm text-gray-500"
};

export const layout = {
  page: {
    root: "min-h-screen bg-gray-50",
    container: "max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8",
    content: "space-y-6"
  }
}; 