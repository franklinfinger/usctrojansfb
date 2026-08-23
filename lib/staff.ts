export type StaffMember = {
  name: string;
  title: string;
  group: "coaching" | "support";
};

// USC Trojans 2026 coaching staff. CFBD's /coaches endpoint only returns
// head coaches, so this fills the gap with static data.
// Source: usctrojans.com official staff page.
export const STAFF: StaffMember[] = [
  { name: "Lincoln Riley", title: "C. & J. Elerding Head Football Coach", group: "coaching" },
  { name: "Luke Huard", title: "Offensive Coordinator / Quarterbacks Coach", group: "coaching" },
  { name: "Gary Patterson", title: "Defensive Coordinator", group: "coaching" },
  {
    name: "Dennis Simmons",
    title: "Assistant Head Coach / Co-Offensive Coordinator / Wide Receivers Coach",
    group: "coaching",
  },
  {
    name: "Anthony Jones Jr.",
    title: "Assistant Head Coach for Offense / Running Backs Coach",
    group: "coaching",
  },
  { name: "Mike Ekeler", title: "Special Teams Coordinator / Linebackers Coach", group: "coaching" },
  { name: "Zach Hanson", title: "Offensive Line Coach / Run Game Coordinator", group: "coaching" },
  {
    name: "Chad Savage",
    title: "Tight Ends / Inside Receivers Coach / Pass Game Coordinator",
    group: "coaching",
  },
  { name: "Paul Gonzales", title: "Safeties Coach / Defensive Pass Game Coordinator", group: "coaching" },
  { name: "Trovon Reed", title: "Cornerbacks Coach", group: "coaching" },
  { name: "Shaun Nua", title: "Defensive End Coach", group: "coaching" },
  { name: "Skyler Jones", title: "Defensive Tackles Coach", group: "coaching" },
  { name: "Rob Ryan", title: "Assistant Head Coach for Defense", group: "support" },
  { name: "AJ Howard", title: "Outside Linebackers Coach", group: "support" },
  { name: "Sam Carter", title: "Assistant Secondary Coach / Nickels", group: "support" },
  { name: "Ryan Dougherty", title: "Co-Special Teams Coordinator / Specialists Coach", group: "support" },
  {
    name: "Chris Meyers",
    title: "Run Game Specialist / Assistant Offensive Line and Tight Ends Coach",
    group: "support",
  },
  { name: "Chad Bowden", title: "General Manager", group: "support" },
];
