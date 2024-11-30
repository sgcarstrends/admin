import { z } from "zod";

export const MaintenanceSchema = z.object({
  enabled: z.boolean(),
});

export type Maintenance = z.infer<typeof MaintenanceSchema>;
