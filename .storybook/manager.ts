import { addons } from "@storybook/manager-api";
import { themes } from "@storybook/theming";

addons.setConfig({
  theme: themes.dark,
  showToolbar: false,
  enableShortcuts: true,
  // since we only have one story, there's no point in this sidebar;
  // set initial sidebar size to 1 pixel (effectively hidden but still "there")
  navSize: 1,
  // Start with sidebar collapsed
  sidebarAnimations: false,
  initialActive: "canvas",
  // Position the addons panel on the right
  panelPosition: "right",
  layoutCustomisations: {
    showSidebar() {
      return false;
    },
    showToolbar() {
      return false;
    },
  },
});
