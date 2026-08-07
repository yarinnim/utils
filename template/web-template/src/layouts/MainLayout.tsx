import { Outlet } from 'react-router';

export default function MainLayout() {
  return (<div>
    <header>Header</header>
    <aside>Sidebar</aside>
    <Outlet />
    <footer>Footer</footer>
  </div>);
}
