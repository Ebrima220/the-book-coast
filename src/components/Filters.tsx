import { useSearchParams } from "react-router-dom";

const mainFilters = [
  { id: "all", label: "All" },
  { id: "fiction", label: "Fiction" },
  { id: "nonfiction", label: "Non-fiction" },
] as const;

const topics = [
  { id: "", label: "All non-fiction" },
  { id: "self-development", label: "Self-Development" },
  { id: "financial-literacy", label: "Financial Literacy" },
] as const;

export function Filters() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category");
  const topic = params.get("topic");

  function update(nextCategory: string | null, nextTopic: string | null) {
    const next = new URLSearchParams(params);
    if (nextCategory) next.set("category", nextCategory);
    else next.delete("category");
    if (nextTopic) next.set("topic", nextTopic);
    else next.delete("topic");
    setParams(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
        {mainFilters.map((filter) => {
          const selected =
            filter.id === "all" ? !category : category === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={selected}
              className={chipClass(selected)}
              onClick={() =>
                update(filter.id === "all" ? null : filter.id, null)
              }
            >
              {filter.label}
            </button>
          );
        })}
      </div>
      {category === "nonfiction" ? (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Non-fiction"
        >
          {topics.map((item) => {
            const selected = item.id ? topic === item.id : !topic;
            return (
              <button
                key={item.label}
                type="button"
                aria-pressed={selected}
                className={chipClass(selected)}
                onClick={() => update("nonfiction", item.id || null)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function chipClass(selected: boolean): string {
  return selected
    ? "rounded-full bg-sea px-3 py-1.5 text-sm font-semibold text-foam"
    : "rounded-full border border-line px-3 py-1.5 text-sm dark:border-white/15";
}
