import React from "react";
import { Table, TBody, TD, TH, THead, TR } from "@/components/common/Table";

export default function DataTable({ columns, rows, emptyMessage = "No rows" }) {
  if (!rows?.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-12 text-center text-sm text-zinc-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <Table>
      <THead>
        <TR>
          {columns.map((col) => (
            <TH key={col.key}>{col.header}</TH>
          ))}
        </TR>
      </THead>
      <TBody>
        {rows.map((row, i) => (
          <TR key={row.id ?? i} className="hover:bg-emerald-50/40">
            {columns.map((col) => (
              <TD key={col.key}>
                {col.render ? col.render(row) : row[col.key]}
              </TD>
            ))}
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
