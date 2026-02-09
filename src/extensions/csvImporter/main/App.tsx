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
  const { handleFileUpload, handleImport, isImporting, isCompleted, progress } =
    useHooks();

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
