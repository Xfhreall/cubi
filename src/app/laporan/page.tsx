import { Suspense } from "react";
import { LaporanContainer } from "@/features/laporan/containers/laporan-container";
import { TableSkeleton } from "@/shared/components/custom/loading-skeleton";

export default function LaporanPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={10} />}>
      <LaporanContainer />
    </Suspense>
  );
}
