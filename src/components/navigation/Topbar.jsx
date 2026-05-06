export default function Topbar({ user }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <header id="topbar">
      <div>
        <h2>
          {greeting} 🌸 {user?.email ? `, ${user.email}` : ""}
        </h2>
        <p>{today}</p>
      </div>
    </header>
  );
}