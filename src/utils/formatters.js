// Format currency ke Rupiah
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format number dengan separator
export const formatNumber = (value) => {
  return new Intl.NumberFormat("id-ID").format(value);
};

// Format percentage
export const formatPercentage = (value) => {
  return `${value}%`;
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Truncate text
export const truncateText = (text, length = 50) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

// Generate avatar color dari nama
export const getAvatarColor = (name) => {
  const colors = [
    "#0D47A1",
    "#880E4F",
    "#1B5E20",
    "#4A148C",
    "#E65100",
    "#006064",
    "#37474F",
    "#B71C1C",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
