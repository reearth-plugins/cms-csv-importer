import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { hexToHSL } from "@/shared/utils";

export default () => {
  const inited = useRef(false);
  const [csvData, setCsvData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>(
    "https://api.cms.reearth.io/api",
  );
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [apiToken, setApiToken] = useState<string>("");

  useLayoutEffect(() => {
    if (!inited.current) {
      const { primaryColor } =
        (
          window as Window & {
            _reearth_plugin_extension_init_data_?: {
              primaryColor?: string;
            };
          }
        )._reearth_plugin_extension_init_data_ ?? {};

      if (primaryColor) {
        const hslColor = hexToHSL(primaryColor);
        if (hslColor) {
          document.documentElement.style.setProperty("--primary", hslColor);
        }
      }
      inited.current = true;
    }
  }, []);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setCsvData(content);
          console.log("CSV file uploaded:", file.name);
          console.log("Content:", content);
        };
        reader.readAsText(file);
      }
    },
    [],
  );

  const handleImport = useCallback(() => {
    if (!csvData) {
      alert("Please select a CSV file first");
      return;
    }

    if (!baseUrl || !workspaceId || !projectId || !modelId || !apiToken) {
      alert("Please fill in all required fields");
      return;
    }

    console.log("Starting CSV import...");
    console.log("Base URL:", baseUrl);
    console.log("Workspace ID:", workspaceId);
    console.log("Project ID:", projectId);
    console.log("Model ID:", modelId);
    console.log("CSV Data:", csvData);

    // TODO: Implement CSV parsing and CMS import API call here
    alert("Import functionality will be implemented here");
  }, [csvData, baseUrl, workspaceId, projectId, modelId, apiToken]);

  return {
    handleFileUpload,
    handleImport,
    csvData,
    fileName,
    baseUrl,
    setBaseUrl,
    workspaceId,
    setWorkspaceId,
    projectId,
    setProjectId,
    modelId,
    setModelId,
    apiToken,
    setApiToken,
  };
};
