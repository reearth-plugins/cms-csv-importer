import html from "@distui/csvImporter/main/index.html?raw";

import { GlobalThis } from "@/shared/reearthTypes";

type WidgetProperty = {
  cmsSettings?: {
    baseUrl?: string;
    workspaceId?: string;
    projectId?: string;
    modelId?: string;
    apiToken?: string;
  };
};

const reearth = (globalThis as unknown as GlobalThis).reearth;
reearth.ui.show(html);

// Get CMS settings from widget properties
const getCMSSettings = () => {
  const property = reearth.extension.widget?.property as WidgetProperty;
  const settings = property?.cmsSettings || {};

  return {
    baseUrl: settings.baseUrl || "https://api.cms.reearth.io/api",
    workspaceId: settings.workspaceId || "",
    projectId: settings.projectId || "",
    modelId: settings.modelId || "",
    apiToken: settings.apiToken || "",
  };
};

// Receive message from Widget side
reearth.extension.on("message", (message: unknown) => {
  const msg = message as { action: string; payload?: any };

  if (msg && typeof msg === "object" && "action" in msg) {
    switch (msg.action) {
      case "getCMSSettings":
        // Get settings from widget properties and send back to UI
        const settings = getCMSSettings();
        reearth.ui.postMessage({
          action: "cmsSettings",
          payload: settings,
        });
        break;

      default:
        break;
    }
  }
});
