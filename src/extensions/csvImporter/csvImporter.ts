import html from "@distui/csvImporter/main/index.html?raw";

import { GlobalThis } from "@/shared/reearthTypes";

const reearth = (globalThis as unknown as GlobalThis).reearth;
reearth.ui.show(html);
