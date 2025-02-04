import { SideNavItem } from "@/types/types";
import {
  IconHome,
  IconDatabase,
  IconFileDownload,
  IconRobot,
  IconSettings,
  IconHelpCircle,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/user/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Generate Dataset",
    path: "/user/generate-dataset",
    icon: <IconDatabase width="24" height="24" />,
  },
  {
    title: "My Datasets",
    path: "/user/my-datasets",
    icon: <IconFileDownload width="24" height="24" />,
  },
  {
    title: "Model Suggestions",
    path: "/user/model-suggestions",
    icon: <IconRobot width="24" height="24" />,
  },
  {
    title: "Settings",
    path: "/user/settings",
    icon: <IconSettings width="24" height="24" />,
  },
  {
    title: "Support",
    path: "/user/support",
    icon: <IconHelpCircle width="24" height="24" />,
  },
];
