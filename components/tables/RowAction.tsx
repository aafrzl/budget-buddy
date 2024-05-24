"use client";

import React, { useState } from "react";
import { TransactionHistoryRow } from "./columns";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import DeleteTransactionDialog from "@/app/(dashboard)/transactions/_components/DeleteTransactionDialog";

export default function RowAction({
  transaction,
}: {
  transaction: TransactionHistoryRow;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DeleteTransactionDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        transactionId={transaction.id}
      />
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => setShowDeleteDialog(true)}
      >
        <TrashIcon className="h-4 w-4 shrink-0 text-rose-500" />
      </Button>
    </>
  );
}
