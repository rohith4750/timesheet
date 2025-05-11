import React from "react";
import HomePage from "../pages/home-page/home-page";
import { MenuItem ,menuItems} from "./menu";

export interface RouteConfig extends Omit<MenuItem, "icon" | "label"> {
  element: React.ReactNode;
  children?: RouteConfig[];
}

const componentMap: Record<string, React.ReactNode> = {
    "/home-page":<HomePage/>
//   "/tab-navigation": <TabNavigationDemo />,
//   "/home": <HomePage />,
//   "/healthcare": <InputFieldPage />,
//   "/phone-number": <PhoneNumberPage />,
//   "/table": <Table />,
//   "/buttons": <ButtonsPage />,
//   "/alerts": <AlertContainer />,
//   "/icons": <Icons />,
//   "/colors": <ColorPalette />,
//   "/typography": <TypographyTable />,
//   "/login": <Login />,
//   "/utility": <Utility />,
//   "/popover-modal": <PopoverModalShowcase />,
};

export const routes: RouteConfig[] = menuItems
  .filter((item) => item.isEnabled !== false)
  .map(({ path }) => ({
    path,
    element: componentMap[path],
  }));