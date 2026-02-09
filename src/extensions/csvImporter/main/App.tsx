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
    isImporting,
    isCompleted,
    errorMessage,
    skippedColumns,
    uploadErrors,
    progress,
  } = useHooks();

  const progressPercentage =
    progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>CMS CSV Importer</CardTitle>
        <CardDescription>
          Configure CMS settings in the widget inspector, then upload a CSV file
          to import
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {errorMessage}
          </div>
        )}
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

        {skippedColumns.length > 0 && (
          <div className="p-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded">
            <div className="font-semibold mb-1">Skipped Columns:</div>
            <div className="text-xs">{skippedColumns.join(", ")}</div>
          </div>
        )}

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

        {uploadErrors.length > 0 && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded max-h-40 overflow-y-auto">
            <div className="font-semibold mb-1">Upload Errors:</div>
            <div className="text-xs space-y-1">
              {uploadErrors.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default App;
