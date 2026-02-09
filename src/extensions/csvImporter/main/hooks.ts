import { useCallback, useState } from "react";
import { parse } from "csv-parse/browser/esm/sync";

// Get model schema from CMS
const getModelSchema = async (
  baseUrl: string,
  workspaceId: string,
  projectId: string,
  modelId: string,
  token: string,
): Promise<any> => {
  try {
    const response = await fetch(
      `${baseUrl}/${workspaceId}/projects/${projectId}/models/${modelId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CMS API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
};

// Upload data to CMS
const uploadToCMS = async (
  baseUrl: string,
  workspaceId: string,
  projectId: string,
  modelId: string,
  token: string,
  data: Record<string, string>,
  fieldMap: Map<string, string>,
): Promise<any> => {
  try {
    // Map CSV data to CMS fields using pre-built field map
    const fields = Object.entries(data)
      .filter(([key]) => fieldMap.has(key))
      .map(([key, value]) => ({
        key,
        type: fieldMap.get(key)!,
        value,
      }));

    const response = await fetch(
      `${baseUrl}/${workspaceId}/projects/${projectId}/models/${modelId}/items`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CMS API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
};

export default () => {
  const [csvData, setCsvData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>(
    "https://api.cms.reearth.io/api",
  );
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [apiToken, setApiToken] = useState<string>("");
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    success: number;
    failed: number;
  }>({ current: 0, total: 0, success: 0, failed: 0 });

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
        };
        reader.readAsText(file);
      }
    },
    [],
  );

  const handleImport = useCallback(async () => {
    if (!csvData) {
      alert("Please select a CSV file first");
      return;
    }

    if (!baseUrl || !workspaceId || !projectId || !modelId || !apiToken) {
      alert("Please fill in all required fields");
      return;
    }

    setIsImporting(true);
    setProgress({ current: 0, total: 0, success: 0, failed: 0 });

    try {
      console.log("Starting CSV import...");

      // First, get model schema
      console.log("Fetching model schema...");
      const modelSchema = await getModelSchema(
        baseUrl,
        workspaceId,
        projectId,
        modelId,
        apiToken,
      );
      console.log("Model schema:", modelSchema);

      // Create field map from schema (key -> type)
      const fieldMap = new Map<string, string>();
      if (modelSchema.schema?.fields) {
        for (const field of modelSchema.schema.fields) {
          fieldMap.set(field.key, field.type);
        }
      }
      console.log("Field map created:", Array.from(fieldMap.entries()));

      // Parse CSV with csv-parse
      const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }) as Record<string, string>[];

      console.log(`Parsed ${records.length} rows from CSV`);

      if (records.length === 0) {
        alert("No data found in CSV file");
        setIsImporting(false);
        return;
      }

      // Validate CSV headers against schema
      const csvHeaders = records.length > 0 ? Object.keys(records[0]) : [];
      const validHeaders = csvHeaders.filter((header) => fieldMap.has(header));
      const invalidHeaders = csvHeaders.filter(
        (header) => !fieldMap.has(header),
      );

      if (invalidHeaders.length > 0) {
        console.warn(
          "Headers not in schema (will be skipped):",
          invalidHeaders,
        );
      }
      console.log("Valid headers:", validHeaders);

      // Initialize progress
      setProgress({ current: 0, total: records.length, success: 0, failed: 0 });

      // Upload each row to CMS
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < records.length; i++) {
        try {
          await uploadToCMS(
            baseUrl,
            workspaceId,
            projectId,
            modelId,
            apiToken,
            records[i],
            fieldMap,
          );
          successCount++;
          console.log(`Uploaded row ${i + 1}/${records.length}`);
        } catch (error) {
          errorCount++;
          console.error(`Failed to upload row ${i + 1}:`, error);
        }

        // Update progress
        setProgress({
          current: i + 1,
          total: records.length,
          success: successCount,
          failed: errorCount,
        });
      }

      setIsCompleted(true);
      alert(
        `Import completed!\n\nTotal: ${records.length}\nSuccess: ${successCount}\nFailed: ${errorCount}`,
      );
    } catch (error) {
      console.error("Import error:", error);
      alert(
        `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setIsCompleted(false);
    } finally {
      setIsImporting(false);
    }
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
    isImporting,
    isCompleted,
    progress,
  };
};
