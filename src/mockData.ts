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

export const INITIAL_AI_BLOCKS: AIBlock[] = [
  {
    id: "1",
    type: "chart",
    title: "Top 10 Performing Employees",
    content: {},
    chartType: "bar",
    timestamp: Date.now()
  },
  {
    id: "2",
    type: "kpi",
    title: "Total Revenue",
    content: { value: "$1.2M", trend: "+12%" },
    timestamp: Date.now()
  },
  {
    id: "3",
    type: "insight",
    title: "Efficiency Alert",
    content: "Tech department efficiency is 15% above average.",
    timestamp: Date.now()
  },
  {
    id: "4",
    type: "chart",
    title: "Salary Distribution",
    content: {},
    chartType: "pie",
    timestamp: Date.now()
  },
  {
    id: "5",
    type: "kpi",
    title: "Active Projects",
    content: { value: "12", trend: "+2" },
    timestamp: Date.now()
  },
  {
    id: "6",
    type: "chart",
    title: "Task Completion Trends",
    content: {},
    chartType: "line",
    timestamp: Date.now()
  },
  {
    id: "7",
    type: "alert",
    title: "Attrition Risk",
    content: "High risk detected in Sales department.",
    alertType: "warning",
    timestamp: Date.now()
  },
  {
    id: "8",
    type: "table",
    title: "Recent Tasks",
    content: [],
    timestamp: Date.now()
  },
  {
    id: "9",
    type: "insight",
    title: "Workload Correlation",
    content: "High correlation between workload and performance score.",
    timestamp: Date.now()
  },
  {
    id: "10",
    type: "kpi",
    title: "Avg Performance",
    content: { value: "84/100", trend: "+5%" },
    timestamp: Date.now()
  }
];

export const AI_SUGGESTIONS: any[] = [
  {
    id: "s1",
    label: "Top 10 performing employees",
    blocks: [
      { type: "chart", title: "Top 10 Performance", content: {}, chartType: "bar" },
      { type: "insight", title: "Performance Insight", content: "Top performers are mostly from the Tech department." }
    ]
  },
  {
    id: "s2",
    label: "Employees at risk",
    blocks: [
      { type: "alert", title: "At Risk Employees", content: "3 employees show declining performance.", alertType: "warning" },
      { type: "table", title: "Risk Details", content: [] }
    ]
  },
  {
    id: "s3",
    label: "Department productivity comparison",
    blocks: [
      { type: "chart", title: "Dept Productivity", content: {}, chartType: "bar" },
      { type: "kpi", title: "Most Productive Dept", content: { value: "Tech", trend: "" } }
    ]
  },
  {
    id: "s4",
    label: "Salary distribution",
    blocks: [
      { type: "chart", title: "Salary Pie", content: {}, chartType: "pie" },
      { type: "insight", title: "Salary Insight", content: "Salary is well-distributed across departments." }
    ]
  },
  {
    id: "s5",
    label: "Workload vs performance correlation",
    blocks: [
      { type: "chart", title: "Workload/Perf Correlation", content: {}, chartType: "line" }
    ]
  },
  {
    id: "s6",
    label: "Project progress overview",
    blocks: [
      { type: "chart", title: "Project Progress", content: {}, chartType: "bar" },
      { type: "kpi", title: "On-track Projects", content: { value: "85%", trend: "+5%" } }
    ]
  },
  {
    id: "s7",
    label: "Team efficiency ranking",
    blocks: [
      { type: "table", title: "Team Efficiency", content: [] }
    ]
  },
  {
    id: "s8",
    label: "Attrition risk analysis",
    blocks: [
      { type: "alert", title: "Attrition Risk", content: "Sales department shows 20% risk.", alertType: "warning" }
    ]
  },
  {
    id: "s9",
    label: "KPI summary dashboard",
    blocks: [
      { type: "kpi", title: "Total Revenue", content: { value: "$1.2M", trend: "+12%" } },
      { type: "kpi", title: "Active Users", content: { value: "45k", trend: "+8%" } }
    ]
  },
  {
    id: "s10",
    label: "Task completion heatmap",
    blocks: [
      { type: "chart", title: "Completion Heatmap", content: {}, chartType: "bar" }
    ]
  }
];

export const DATA_SOURCES: DataSource[] = [
  { id: "1", name: "Google Sheets", icon: "Sheet", status: "Connected", size: "1.2 MB", lastUpdated: "2 mins ago" },
  { id: "2", name: "Excel Upload", icon: "FileSpreadsheet", status: "Connected", size: "850 KB", lastUpdated: "1 hour ago" },
  { id: "3", name: "MISA", icon: "Database", status: "Connected", size: "4.5 MB", lastUpdated: "10 mins ago" },
  { id: "4", name: "Odoo", icon: "Box", status: "Disconnected", size: "0 KB", lastUpdated: "Never" },
];
