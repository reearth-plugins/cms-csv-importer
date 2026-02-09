import { useCallback, useState } from "react";
import { parse } from "csv-parse/browser/esm/sync";

import { getModelSchema, uploadToCMS } from "./cmsApi";

export default () => {
  const [csvData, setCsvData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [skippedColumns, setSkippedColumns] = useState<string[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
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
      setErrorMessage("Please select a CSV file first");
      return;
    }

    setIsImporting(true);
    setErrorMessage("");
    setUploadErrors([]);
    setProgress({ current: 0, total: 0, success: 0, failed: 0 });

    try {
      console.log("Starting CSV import...");

      // Request CMS settings from extension
      console.log("Requesting CMS settings...");
      const settingsPromise = new Promise<{
        baseUrl: string;
        workspaceId: string;
        projectId: string;
        modelId: string;
        apiToken: string;
      }>((resolve) => {
        const handler = (e: MessageEvent) => {
          if (e.data?.action === "cmsSettings") {
            window.removeEventListener("message", handler);
            resolve(e.data.payload);
          }
        };
        window.addEventListener("message", handler);
        window.parent.postMessage({ action: "getCMSSettings" }, "*");
      });

      const settings = await settingsPromise;
      console.log("CMS settings received");

      const { baseUrl, workspaceId, projectId, modelId, apiToken } = settings;

      if (!baseUrl || !workspaceId || !projectId || !modelId || !apiToken) {
        setErrorMessage(
          "Please configure CMS settings in the widget inspector",
        );
        setIsImporting(false);
        return;
      }

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
        setErrorMessage("No data found in CSV file");
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
        setSkippedColumns(invalidHeaders);
      } else {
        setSkippedColumns([]);
      }
      console.log("Valid headers:", validHeaders);

      // Initialize progress
      setProgress({ current: 0, total: records.length, success: 0, failed: 0 });

      // Upload each row to CMS
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

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
          const errorMsg =
            error instanceof Error ? error.message : "Unknown error";
          const errorText = `Row ${i + 1}: ${errorMsg}`;
          errors.push(errorText);
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

      setUploadErrors(errors);
      setIsCompleted(true);
      alert(
        `Import completed!\n\nTotal: ${records.length}\nSuccess: ${successCount}\nFailed: ${errorCount}`,
      );
    } catch (error) {
      console.error("Import error:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(`Import failed: ${errorMsg}`);
      setIsCompleted(false);
    } finally {
      setIsImporting(false);
    }
  }, [csvData]);

  return {
    handleFileUpload,
    handleImport,
    csvData,
    fileName,
    isImporting,
    isCompleted,
    errorMessage,
    skippedColumns,
    uploadErrors,
    progress,
  };
};
