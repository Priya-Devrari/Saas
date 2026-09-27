"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { subjects } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import {
  formUrlQuery,
  removeKeysFromUrlQuery,
} from "@jsmastery/utils";

const SubjectFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSubject = searchParams.get("subject") || "all";

  const [subject, setSubject] = useState(currentSubject);

  const handleSubjectChange = (value: string | null) => {
    if (value === null) return;

    setSubject(value);

    let newUrl = "";

    if (value === "all") {
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["subject"],
      });
    } else {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "subject",
        value,
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <Select
      onValueChange={handleSubjectChange}
      value={subject}
    >
      <SelectTrigger className="input capitalize">
        <SelectValue placeholder="Subject" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">
          All subjects
        </SelectItem>

        {subjects.map((subject) => (
          <SelectItem
            key={subject}
            value={subject}
            className="capitalize"
          >
            {subject}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectFilter;