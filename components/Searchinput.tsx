"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const Searchinput = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("topic") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    // Don't update the URL if it already has the same value
    if (searchQuery === query) {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery) {
        params.set("topic", searchQuery);
      } else {
        params.delete("topic");
      }

      const queryString = params.toString();
      const newUrl = queryString
        ? `${pathname}?${queryString}`
        : pathname;

      router.push(newUrl, { scroll: false });
    }, 500);

    // Clear the previous timeout
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, query, pathname, router, searchParams]);

  return (
    <div className="relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit">
      <Image
        src="/icons/search.svg"
        alt="search"
        width={15}
        height={15}
        className="object-contain"
      />

      <input
        type="text"
        placeholder="Search Companions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="outline-none"
      />
    </div>
  );
};

export default Searchinput;