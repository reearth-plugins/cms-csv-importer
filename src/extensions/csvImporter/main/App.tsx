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
  } = useHooks();

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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="csv-file">CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />
        </div>

        <Button className="w-full gap-2" onClick={handleImport}>
          <Upload className="w-4 h-4" />
          Import CSV to CMS
        </Button>
      </CardContent>
    </Card>
  );
}

export default App;
