'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Line,
  Pie,
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Cell,
} from "recharts";

const mockLineData = [
  { date: "2025-03-10", amount: 32 },
  { date: "2025-03-15", amount: 55 },
  { date: "2025-03-20", amount: 12 },
  { date: "2025-03-25", amount: 80 },
  { date: "2025-03-30", amount: 45 },
  { date: "2025-04-04", amount: 60 },
];

const mockPieData = [
  { name: "Alimentation", value: 300 },
  { name: "Transport", value: 200 },
  { name: "Loisirs", value: 400 },
  { name: "Santé", value: 150 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

export default function DashboardHome() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Total dépenses ce mois */}
      <Card>
        <CardHeader>
          <CardTitle>Total du mois</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">672.00 CAD</p>
          <p className="text-sm text-muted-foreground">+8.5% par rapport au mois précédent</p>
        </CardContent>
      </Card>

      {/* Plus grosse dépense */}
      <Card>
        <CardHeader>
          <CardTitle>Plus grosse dépense</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-medium">Loisirs - 120.00 CAD</p>
          <p className="text-sm text-muted-foreground">le 25 mars 2025</p>
        </CardContent>
      </Card>
 {/* Pie Chart */}
 <Card>
        <CardHeader>
          <CardTitle>Catégories de dépenses</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {mockPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
       
      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Dépenses quotidiennes</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockLineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

     
    </div>
  );
}
