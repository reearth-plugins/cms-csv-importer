import { Upload } from "lucide-react";

import useHooks from "./hooks";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Progress } from "@/shared/components/ui/progress";

function App() {
  const {
    handleFileUpload,
    handleImport,
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
  } = useHooks();

  const progressPercentage =
    progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>CMS CSV Importer</CardTitle>
        <CardDescription>
          Upload a CSV file to import data into CMS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="base-url">Base URL</Label>
          <Input
            id="base-url"
            type="text"
            placeholder="Enter base URL"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            disabled={isImporting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workspace-id">Workspace ID</Label>
          <Input
            id="workspace-id"
            type="text"
            placeholder="Enter workspace ID"
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            disabled={isImporting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-id">Project ID</Label>
          <Input
            id="project-id"
            type="text"
            placeholder="Enter project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={isImporting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model-id">Model ID</Label>
          <Input
            id="model-id"
            type="text"
            placeholder="Enter model ID"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            disabled={isImporting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-token">Integration API Token</Label>
          <Input
            id="api-token"
            type="password"
            placeholder="Enter API token"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            disabled={isImporting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="csv-file">CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isImporting}
          />
        </div>

        <Button
          className="w-full gap-2"
          onClick={handleImport}
          disabled={isImporting}
        >
          <Upload className="w-4 h-4" />
          {isImporting ? "Importing..." : "Import CSV to CMS"}
        </Button>

        {(isImporting || isCompleted) && progress.total > 0 && (
          <div className="space-y-2 pt-2 border-t">
            {isCompleted && (
              <div className="text-center text-sm font-semibold text-green-600">
                Import Completed
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>
                Progress: {progress.current} / {progress.total}
              </span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className="text-green-600">
                Success: {progress.success}
              </span>
              <span className="text-red-600">Failed: {progress.failed}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default App;
