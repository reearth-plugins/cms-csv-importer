import html from "@distui/csvImporter/main/index.html?raw";

import { GlobalThis } from "@/shared/reearthTypes";

type WidgetProperty = { appearance?: { primary_color?: string } };

const reearth = (globalThis as unknown as GlobalThis).reearth;
reearth.ui.show(html);

// Post message to UI when initialize
reearth.ui.postMessage({
  action: "__init__",
  payload: {
    primaryColor: (reearth.extension.widget?.property as WidgetProperty)
      ?.appearance?.primary_color,
  },
});
