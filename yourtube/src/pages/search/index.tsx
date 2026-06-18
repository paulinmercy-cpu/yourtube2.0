import SearchResult from "@/components/SearchResult";
import { useRouter } from "next/router";
import React, { Suspense } from "react";

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query;

  const searchQuery = Array.isArray(q)
    ? q[0]
    : q || "";

  return (
    <div className="p-6">
      {searchQuery && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Search results for "{searchQuery}"
          </h1>
        </div>
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <SearchResult query={searchQuery} />
      </Suspense>
    </div>
  );
};

export default SearchPage;