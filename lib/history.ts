export function saveToHistory(item: {
  name: string;
  count: number;
  score: number;
}) {

  const old = JSON.parse(
    localStorage.getItem("history") || "[]"
  );

  localStorage.setItem(
    "history",
    JSON.stringify([...old, { ...item, date: new Date() }])
  );
}

export function getHistory() {
  return JSON.parse(
    localStorage.getItem("history") || "[]"
  );
}
