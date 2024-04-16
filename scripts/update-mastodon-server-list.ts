import fs from "node:fs";

async function main() {
  const instances = await grabMastodonInstances();
  const instanceUrls = instances.instances.map((i) => i.name);
  fs.writeFileSync(
    "./src/services/mastodon-servers.data.json",
    JSON.stringify(instanceUrls, undefined, 2)
  );
}

function grabMastodonInstances() {
  const search = new URLSearchParams({
    include_down: "false",
    include_dead: "false",
    include_closed: "false",
    min_users: "5",
    min_active_users: "5",
    min_version: "3",
    sort_by: "active_users",
    sort_order: "desc",
    count: "0", // 0 = all
  });

  return fetch(
    "https://instances.social/api/1.0/instances/list?" + search.toString(),
    {
      headers: {
        Authorization: `Bearer ${process.env.MASTODON_INSTANCES_TOKEN}`,
      },
    }
  ).then((res): Promise<Instances> => res.json());
}

interface Instances {
  // /!\ troncated interface /!\
  instances: Array<{ name: string }>;
}

(async () => await main())();
