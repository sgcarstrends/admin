"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Props {
  maintenance: boolean;
}

export const MaintenanceToggle = ({ maintenance }: Props) => {
  const [enabled, setEnabled] = useState(maintenance);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled: checked }),
      });

      if (!response.ok) {
        throw new Error("Failed to update maintenance status");
      }

      const data = await response.json();
      setEnabled(data.maintenance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setEnabled(!checked); // Revert the toggle
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Maintenance Mode</CardTitle>
        <CardDescription>
          Toggle maintenance mode to temporarily disable access to the
          application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isLoading}
            className="data-[state=checked]:bg-blue-600"
          />
          <Label>
            {enabled ? "Maintenance Mode Active" : "Maintenance Mode Inactive"}
          </Label>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {enabled && (
          <Alert>
            <AlertDescription>
              The site is currently in maintenance mode. Only administrators can
              access it.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
