import { MaintenanceToggle } from "@/components/MaintenanceToggle";

const MaintenancePage = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/admin/maintenance`,
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const { maintenance } = await response.json();

  return <MaintenanceToggle maintenance={maintenance} />;
};

export default MaintenancePage;
