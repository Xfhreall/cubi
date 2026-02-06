import { Suspense } from "react";
import { PegawaiListContainer } from "@/features/pegawai/containers/pegawai-list-container";
import { TableSkeleton } from "@/shared/components/custom/loading-skeleton";

export default function PegawaiPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={10} />}>
      <PegawaiListContainer />
    </Suspense>
  );
}
