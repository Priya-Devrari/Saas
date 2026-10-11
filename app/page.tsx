import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionList";
import CTA from "@/components/Cta";
import {
  getAllCompanions,
  getRecentSessions,
} from "@/lib/companion.action";
import { getSubjectColor } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Page = async () => {
  const companions = await getAllCompanions({
    limit: 50,
  });

  const popularCompanions = companions.slice(0, 3);

  const recentSessionsCompanions =
    await getRecentSessions(10);

  return (
    <main>
      <h1>Popular Companions</h1>

      <section className="home-section">
       <div className="companions-grid grid grid-cols-3 gap-4">
          {popularCompanions.map((companion) => (
            <CompanionCard
              key={companion.id}
              {...companion}
              color={getSubjectColor(companion.subject)}
            />
          ))}
        </div>
      </section>

      <section className="home-section">
        <Tabs defaultValue="recent" className="w-full">

          <TabsList>
            <TabsTrigger value="recent">
              Recently Completed
            </TabsTrigger>

            <TabsTrigger value="available">
              Available Companions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent">
            {recentSessionsCompanions.length > 0 ? (
              <CompanionsList
                title="Recently Completed"
                companions={recentSessionsCompanions}
                classNames="w-full max-h-[500px] overflow-y-auto"
              />
            ) : (
              <div className="companion-list">
                <h2>Recently Completed</h2>
                <p>No completed sessions yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="available">
            <CompanionsList
              title="Available Companions"
              companions={companions}
              classNames="w-full max-h-[500px] overflow-y-auto"
            />
          </TabsContent>

        </Tabs>

        <CTA />
      </section>
    </main>
  );
};

export default Page;