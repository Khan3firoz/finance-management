import { Suspense } from "react";
import { BudgetsClient } from "./budgets-client";

export default function BudgetsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BudgetsClient />
    </Suspense>
  );
}
