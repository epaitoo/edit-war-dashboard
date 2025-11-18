export interface EditWarAlert {
  id: number;
  pageTitle: string;
  wiki: string;
  severityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  severityScore: number;
  totalEdits: number;
  conflictEdits: number;
  conflictRatio: number;
  userCount: number;
  involvedUsers: string[];
  firstEditTimestamp: number;
  lastEditTimestamp: number;
  detectedAt: string;
  status: 'ACTIVE' | 'RESOLVED' | 'ESCALATING' | 'COOLING_DOWN';
}

export const mockAlerts: EditWarAlert[] = [
    {
        id: 1,
        pageTitle: "Donald_Trump",
        wiki: "en.wikipedia.org",
        severityLevel: "CRITICAL",
        severityScore: 0.93,
        totalEdits: 14,
        conflictEdits: 13,
        conflictRatio: 0.93,
        userCount: 2,
        involvedUsers: ["Alice", "Bob"],
        firstEditTimestamp: Date.now() / 1000 - 1200,
        lastEditTimestamp: Date.now() / 1000 - 120,
        detectedAt: new Date(Date.now() - 120000).toISOString(),
        status: "ACTIVE"
    },
    {
        id: 2,
        pageTitle: "Climate_Change",
        wiki: "en.wikipedia.org",
        severityLevel: "HIGH",
        severityScore: 0.67,
        totalEdits: 12,
        conflictEdits: 8,
        conflictRatio: 0.67,
        userCount: 3,
        involvedUsers: ["UserA", "UserB", "UserC"],
        firstEditTimestamp: Date.now() / 1000 - 3600,
        lastEditTimestamp: Date.now() / 1000 - 300,
        detectedAt: new Date(Date.now() - 300000).toISOString(),
        status: "ACTIVE"
    }
]

export interface Stats {
  activeWars: number;
  editsToday: number;
  criticalAlerts: number;
}

export const mockStats: Stats = {
  activeWars: 5,
  editsToday: 12847,
  criticalAlerts: 2
};

export const hotPages = [
  { page: "Donald_Trump", wars: 12 },
  { page: "Israel", wars: 8 },
  { page: "Climate_Change", wars: 6 }
];