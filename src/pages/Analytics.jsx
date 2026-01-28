import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => {
      setAnalytics(res.data);
      setLoading(false);
    });
  }, []);

  const topSubjectsData = {
    labels: analytics?.topSubjects.map((s) => s.subject),
    datasets: [
      {
        label: "# of Requests",
        data: analytics?.topSubjects.map((s) => s.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const topTeachersData = {
    labels: analytics?.topTeachers.map((t) => t.name),
    datasets: [
      {
        label: "Assignments Matched",
        data: analytics?.topTeachers.map((t) => t.count),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div>
      <h1 className="page-header">Platform Analytics</h1>
      <div className="large-grid">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
            Top Requested Subjects
          </h3>
          <div style={{ height: "300px" }}>
            <Pie
              data={topSubjectsData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
            Top Performing Teachers
          </h3>
          <div style={{ height: "300px" }}>
            <Bar
              data={topTeachersData}
              options={{ maintainAspectRatio: false, indexAxis: "y" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
