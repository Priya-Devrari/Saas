'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  addBookmark,
  removeBookmark,
  getBookmarkedCompanions,
} from "@/lib/companion.action";

interface companionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
}: companionCardProps) => {
  const { user } = useUser();
  const pathname = usePathname();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkBookmark = async () => {
      if (!user) return;

      const bookmarkedCompanions = (await getBookmarkedCompanions(user.id)) as unknown as Array<{
        id: string;
      } | null>;

      const exists = bookmarkedCompanions.some(
        (companion) => companion?.id === id
      );

      setIsBookmarked(exists);
    };

    checkBookmark();
  }, [user, id]);

  const handleBookmark = async () => {
    if (!user) return;

    if (isBookmarked) {
      await removeBookmark(id, pathname);
      setIsBookmarked(false);
    } else {
      await addBookmark(id, pathname);
      setIsBookmarked(true);
    }
  };

  return (
    <article
      className="companion-card"
      style={{ backgroundColor: color }}
    >
      <div className="flex justify-between items-center">
        <div className="subject-badge">{subject}</div>

        <button
          type="button"
          className="companion-bookmark"
          onClick={handleBookmark}
        >
          <Image
            src={
              isBookmarked
                ? "/icons/bookmark-filled.svg"
                : "/icons/bookmark.svg"
            }
            alt={isBookmarked ? "Remove bookmark" : "Bookmark"}
            width={20}
            height={20}
          />
        </button>
      </div>

      <h2 className="text-2xl font-bold">{name}</h2>

      <p className="text-sm">
        Topic: {topic}
      </p>

      <div className="flex items-center gap-2">
        <Image
          src="/icons/clock.svg"
          alt="clock"
          width={13.5}
          height={13.6}
        />

        <p className="text-sm">
          Duration: {duration} minutes
        </p>
      </div>

      <Link
        href={`/companions/${id}`}
        className="btn-primary w-full justify-center"
      >
        Launch Lesson
      </Link>
    </article>
  );
};

export default CompanionCard;