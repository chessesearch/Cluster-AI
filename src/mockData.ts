import { Employee, Task, Department, WorkStatus, TaskStatus, DataSource, AIBlock } from "./types";

const DEPARTMENTS: Department[] = ["HR", "Tech", "Sales", "Marketing"];
const POSITIONS: Record<Department, string[]> = {
  HR: ["HR Manager", "Recruiter", "HR Specialist", "HR Analyst"],
  Tech: ["Frontend Engineer", "Backend Engineer", "DevOps Engineer", "Data Scientist", "Product Manager"],
  Sales: ["Account Executive", "Sales Representative", "Sales Manager", "Business Development"],
  Marketing: ["Marketing Specialist", "Content Creator", "SEO Expert", "Marketing Manager"],
};
const WORK_STATUSES: WorkStatus[] = ["Active", "Leave", "Resigned"];
const TASK_STATUSES: TaskStatus[] = ["Pending", "In Progress", "Completed"];
const MANAGERS = ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Edward Norton"];
const PROJECTS = ["Project Phoenix", "Project Alpha", "Project Beta", "Project Gamma", "Project Delta"];

export function generateMockData() {
  const employees: Employee[] = [];
  const tasks: Task[] = [];

  for (let i = 1; i <= 70; i++) {
    const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const pos = POSITIONS[dept][Math.floor(Math.random() * POSITIONS[dept].length)];
    const status = Math.random() > 0.1 ? "Active" : Math.random() > 0.5 ? "Leave" : "Resigned";
    const performance = Math.floor(Math.random() * 60) + 40; // 40-100
    const taskCompletion = Math.floor(Math.random() * 100);

    const employee: Employee = {
      id: `EMP-${i.toString().padStart(3, "0")}`,
      name: `Employee ${i}`,
      department: dept,
      position: pos,
      salary: Math.floor(Math.random() * 5000) + 3000,
      performanceScore: performance,
      taskCompletion: taskCompletion,
      joinDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split("T")[0],
      manager: MANAGERS[Math.floor(Math.random() * MANAGERS.length)],
      projectAssigned: PROJECTS[Math.floor(Math.random() * PROJECTS.length)],
      workStatus: status as WorkStatus,
    };
    employees.push(employee);

    // Generate 1-3 tasks per employee
    const numTasks = Math.floor(Math.random() * 3) + 1;
    for (let j = 1; j <= numTasks; j++) {
      tasks.push({
        id: `TSK-${i}-${j}`,
        employeeId: employee.id,
        taskName: `Task ${j} for ${employee.id}`,
        progress: Math.floor(Math.random() * 100),
        deadline: new Date(2026, 3, Math.floor(Math.random() * 30) + 1).toISOString().split("T")[0],
        status: TASK_STATUSES[Math.floor(Math.random() * TASK_STATUSES.length)],
      });
    }
  }

  return { employees, tasks };
}

// Helper to generate chart data
const genTimeData = (len = 10) => Array.from({ length: len }, (_, i) => ({
  name: `Point ${i + 1}`,
  value: Math.floor(Math.random() * 100),
  secondary: Math.floor(Math.random() * 80)
}));

const genScatterData = (len = 20) => Array.from({ length: len }, () => ({
  x: Math.floor(Math.random() * 100),
  y: Math.floor(Math.random() * 100),
  z: Math.floor(Math.random() * 1000)
}));

const genBoxPlotData = () => [
  { name: 'Group A', min: 10, q1: 25, median: 45, q3: 70, max: 95 },
  { name: 'Group B', min: 15, q1: 30, median: 50, q3: 65, max: 90 },
  { name: 'Group C', min: 5, q1: 20, median: 40, q3: 75, max: 100 },
];

const genCSATTrend = () => [
  { name: 'Jan', satisfied: 65, neutral: 20, unsatisfied: 15 },
  { name: 'Feb', satisfied: 68, neutral: 22, unsatisfied: 10 },
  { name: 'Mar', satisfied: 72, neutral: 18, unsatisfied: 10 },
  { name: 'Apr', satisfied: 70, neutral: 20, unsatisfied: 10 },
  { name: 'May', satisfied: 75, neutral: 15, unsatisfied: 10 },
  { name: 'Jun', satisfied: 80, neutral: 12, unsatisfied: 8 },
  { name: 'Jul', satisfied: 78, neutral: 15, unsatisfied: 7 },
  { name: 'Aug', satisfied: 85, neutral: 12, unsatisfied: 3 },
  { name: 'Sept', satisfied: 82, neutral: 14, unsatisfied: 4 },
  { name: 'Oct', satisfied: 84, neutral: 12, unsatisfied: 4 },
  { name: 'Nov', satisfied: 86, neutral: 10, unsatisfied: 4 },
  { name: 'Dec', satisfied: 88, neutral: 8, unsatisfied: 4 },
];

const genMonthlySales = () => [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Apr', value: 61000 },
  { name: 'May', value: 55000 },
  { name: 'Jun', value: 190350, highlight: true },
  { name: 'Jul', value: 68000 },
  { name: 'Aug', value: 72000 },
  { name: 'Sept', value: 85000 },
  { name: 'Oct', value: 78000 },
  { name: 'Nov', value: 92000 },
  { name: 'Dec', value: 110000 },
];

export const INITIAL_AI_BLOCKS: AIBlock[] = [
  {
    id: "a1",
    type: "chart",
    title: "Performance Distribution",
    content: genTimeData(7),
    chartType: "histogram",
    timestamp: 1712995200000
  },
  {
    id: "a2",
    type: "chart",
    title: "Revenue vs Cost",
    content: genTimeData(12),
    chartType: "area",
    timestamp: 1712995200000
  },
  {
    id: "a3",
    type: "chart",
    title: "Project Correlation",
    content: genScatterData(15),
    chartType: "scatter",
    timestamp: 1712995200000
  },
  {
    id: "a4",
    type: "chart",
    title: "Salary Ranges",
    content: genBoxPlotData(),
    chartType: "boxplot",
    timestamp: 1712995200000
  },
  {
    id: "a5",
    type: "chart",
    title: "Market Share",
    content: [
      { name: "Direct", value: 400 },
      { name: "Social", value: 300 },
      { name: "Organic", value: 300 },
      { name: "Ads", value: 200 },
    ],
    chartType: "pie",
    timestamp: 1712995200000
  }
];

export const DEFAULT_DASHBOARD_BLOCKS: any[] = [
  // ROW 1: KPIs
  {
    id: "d1",
    type: "kpi",
    title: "Total sales",
    data: { value: "$ 4,9M", change: "+18%", trend: "up", subtitle: "to previous year" },
    gridX: 0, gridY: 0, gridWidth: 15, gridHeight: 12
  },
  {
    id: "d2",
    type: "kpi",
    title: "Total expenses",
    data: { value: "$ 860K", change: "-25%", trend: "down", subtitle: "to previous year" },
    gridX: 15, gridY: 0, gridWidth: 15, gridHeight: 12
  },
  {
    id: "d5",
    type: "kpi",
    title: "Overall AI impact score",
    data: { value: "92", subtitle: "based on a weighted average of the KPIs" },
    gridX: 30, gridY: 0, gridWidth: 15, gridHeight: 12
  },
  {
    id: "d4",
    type: "kpi",
    title: "Customer satisfaction score",
    data: { value: "85%", change: "+15%", trend: "up", subtitle: "to previous year" },
    gridX: 45, gridY: 0, gridWidth: 15, gridHeight: 12
  },
  
  // ROW 2: Charts (below KPIs)
  {
    id: "d6",
    type: "chart",
    title: "Customer satisfaction analysis",
    data: genCSATTrend(),
    chartType: "line",
    gridX: 0, gridY: 12, gridWidth: 30, gridHeight: 24,
    insightText: "CSAT August '24: 350 +21%"
  },
  {
    id: "d3",
    type: "chart",
    title: "Sales analytics",
    data: genMonthlySales(),
    chartType: "bar",
    gridX: 30, gridY: 12, gridWidth: 30, gridHeight: 24,
    insightText: "Income: June '24 (AI implementation) $190,350 +25%"
  },

  // RIGHT SIDE: Large Donut Chart spanning both rows
  {
    id: "d7",
    type: "chart",
    title: "Expenses analytics",
    data: [
      { name: "salaries", value: 400000, color: "#818cf8" },
      { name: "operational costs", value: 180000, color: "#f472b6" },
      { name: "marketing", value: 160000, color: "#fbbf24" },
      { name: "supply chain", value: 120000, color: "#34d399" },
      { name: "costs saved", value: 150000, color: "#22d3ee" },
    ],
    chartType: "pie",
    gridX: 60, gridY: 0, gridWidth: 15, gridHeight: 36,
    insightText: "$150,000 costs saved | 30% reduced overstock"
  }
];

export const AI_SUGGESTIONS: any[] = [
  {
    id: "s1",
    label: "Analyze performance distribution",
    blocks: [
      { type: "chart", title: "Performance Hist", content: genTimeData(10), chartType: "histogram" },
      { type: "insight", title: "Distribution Insight", content: "Performance is negatively skewed." }
    ]
  },
  {
    id: "s2",
    label: "Correlate workload with output",
    blocks: [
      { type: "chart", title: "Workload/Output", content: genScatterData(15), chartType: "scatter" }
    ]
  },
  {
    id: "s3",
    label: "Salary distribution by role",
    blocks: [
      { type: "chart", title: "Salary Ranges", content: genBoxPlotData(), chartType: "boxplot" }
    ]
  },
  {
    id: "s4",
    label: "Regional growth trends",
    blocks: [
      { type: "chart", title: "Growth Area", content: genTimeData(12), chartType: "area" }
    ]
  }
];

export const DATA_SOURCES: DataSource[] = [
  { id: "1", name: "Google Sheets", icon: "Sheet", status: "Connected", size: "1.2 MB", lastUpdated: "2 mins ago" },
  { id: "2", name: "Excel Upload", icon: "FileSpreadsheet", status: "Connected", size: "850 KB", lastUpdated: "1 hour ago" },
  { id: "3", name: "MISA", icon: "Database", status: "Connected", size: "4.5 MB", lastUpdated: "10 mins ago" },
  { id: "4", name: "Odoo", icon: "Box", status: "Disconnected", size: "0 KB", lastUpdated: "Never" },
];

