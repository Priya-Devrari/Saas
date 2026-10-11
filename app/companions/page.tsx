import { getAllCompanions } from "@/lib/companion.action";
import { getSubjectColor } from "@/lib/utils";
import CompanionCard from "@/components/CompanionCard";
import Searchinput from "@/components/Searchinput";
import SubjectFilter from "@/components/SubjectFilter";

const CompanionsLibrary = async ({
  searchParams,
}: SearchParams) => {

  const filters = await searchParams;

  const subject = Array.isArray(filters.subject)
    ? filters.subject[0]
    : filters.subject;

  const topic = Array.isArray(filters.topic)
    ? filters.topic[0]
    : filters.topic;

  const companions = await getAllCompanions({
    subject,
    topic,
  });

  return (
    <main>

      <section className="flex justify-between gap-4 max-sm:flex-col">

        <h1>Companions Library</h1>

        <div className="flex gap-4">
          <Searchinput />
          <SubjectFilter />
        </div>

      </section>

      <section className="companions-grid max-h-[600px] overflow-y-auto">

        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}

      </section>

    </main>
  );
};

export default CompanionsLibrary;