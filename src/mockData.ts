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

export const INITIAL_AI_BLOCKS: AIBlock[] = [
  {
    id: "a1",
    type: "chart",
    title: "Performance Distribution",
    content: genTimeData(7),
    chartType: "histogram",
    timestamp: Date.now()
  },
  {
    id: "a2",
    type: "chart",
    title: "Revenue vs Cost",
    content: genTimeData(12),
    chartType: "area",
    timestamp: Date.now()
  },
  {
    id: "a3",
    type: "chart",
    title: "Project Correlation",
    content: genScatterData(15),
    chartType: "scatter",
    timestamp: Date.now()
  },
  {
    id: "a4",
    type: "chart",
    title: "Salary Ranges",
    content: genBoxPlotData(),
    chartType: "boxplot",
    timestamp: Date.now()
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
    timestamp: Date.now()
  }
];

export const DEFAULT_DASHBOARD_BLOCKS: any[] = [
  {
    id: "d1",
    type: "kpi",
    title: "Active Users",
    data: { value: "14,284", change: "+12.5%", trend: "up" },
    gridX: 0, gridY: 0, gridWidth: 8, gridHeight: 8
  },
  {
    id: "d2",
    type: "chart",
    title: "Revenue Streams",
    data: genTimeData(6),
    chartType: "area",
    gridX: 8, gridY: 0, gridWidth: 16, gridHeight: 12,
    insightText: "Strong growth in organic channels this month."
  },
  {
    id: "d3",
    type: "chart",
    title: "Employee distribution",
    data: [
      { name: "Tech", value: 45 },
      { name: "HR", value: 12 },
      { name: "Sales", value: 28 },
      { name: "Marketing", value: 15 },
    ],
    chartType: "pie",
    gridX: 24, gridY: 0, gridWidth: 10, gridHeight: 12
  },
  {
    id: "d4",
    type: "chart",
    title: "Efficiency Scatter",
    data: genScatterData(20),
    chartType: "scatter",
    gridX: 0, gridY: 8, gridWidth: 8, gridHeight: 12
  },
  {
    id: "d5",
    type: "chart",
    title: "Department Comparison",
    data: genTimeData(5),
    chartType: "bar",
    gridX: 8, gridY: 12, gridWidth: 12, gridHeight: 10
  },
  {
    id: "d6",
    type: "chart",
    title: "Performance BoxPlot",
    data: genBoxPlotData(),
    chartType: "boxplot",
    gridX: 20, gridY: 12, gridWidth: 14, gridHeight: 10
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

