import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div>
      <header>
        <h2>Meu Sistema</h2>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>© 2026</p>
      </footer>
    </div>
  );
}