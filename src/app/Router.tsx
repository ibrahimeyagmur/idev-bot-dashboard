import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AppLayout } from "../components/layout";
import { DashboardLayout } from "../components/dashboard";
import {
  HomePage,
  CommandsPage,
  SupportPage,
  DashboardPage,
  NotFoundPage,
  WelcomePage as PublicWelcomePage,
  LevelPage as PublicLevelPage,
  EmbedPage as PublicEmbedPage,
  AutomationPage as PublicAutomationPage,
} from "../pages";
import {
  OverviewPage,
  SettingsPage,
  WelcomePage,
  LevelsPage,
  EmbedsPage,
  AutoModPage,
  AutoReplyPage,
} from "../pages/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "komutlar", element: <CommandsPage /> },
      { path: "destek", element: <SupportPage /> },
      { path: "support", element: <Navigate to="/destek" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      {
        path: "ozellikler/karsilama-mesajlari",
        element: <PublicWelcomePage />,
      },
      { path: "ozellikler/seviye-sistemi", element: <PublicLevelPage /> },
      { path: "ozellikler/gomulu-mesajlar", element: <PublicEmbedPage /> },
      { path: "ozellikler/otomasyon", element: <PublicAutomationPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/dashboard/:serverId",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "welcome", element: <WelcomePage /> },
      { path: "levels", element: <LevelsPage /> },
      { path: "embeds", element: <EmbedsPage /> },
      { path: "automod", element: <AutoModPage /> },
      { path: "autoreply", element: <AutoReplyPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
