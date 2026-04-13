"use client";

import React, { useMemo, useState } from "react";
import Pagination from "@/components/common/Pagination";
import ProductCard from "@/components/frontend/ProductCard";
import { getProducts } from "@/services/products";

const PAGE_SIZE = 3;

export default function FeaturedProductSection() {
  const products = useMemo(() => getProducts(), []);
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const slice = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {slice.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {totalPages > 1 ? (
        <div className="mt-10">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : null}
    </>
  );
}
