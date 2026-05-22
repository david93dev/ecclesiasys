import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="dashboard/index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'dashboard',
          title: '',
        }}
      />
    </Drawer>
  );
}
