import { Suspense } from "react";
import { AbsensiContainer } from "@/features/absensi/containers/absensi-container";
import { TableSkeleton } from "@/shared/components/custom/loading-skeleton";

export default function AbsensiPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={10} />}>
      <AbsensiContainer />
    </Suspense>
  );
}
