export default function formatDate(dateString: string) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}