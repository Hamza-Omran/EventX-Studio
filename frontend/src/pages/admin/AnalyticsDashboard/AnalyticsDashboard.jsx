import React, { useEffect, useState } from "react";
import LoadingDots from "@/components/LoadingDots/LoadingDots";
import { Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from "chart.js";
import "./AnalyticsDashboard.css";
import {
    FaCalendarAlt,
    FaRocket,
    FaMapMarkerAlt,
    FaImage,
    FaBarcode,
    FaUsers,
    FaFilter,
    FaSearch,
} from "react-icons/fa";
import StatCard from "@/components/Analytics/StatCard";
import api from "@/api/axiosInstance";
import { calculateAnalyticsStats } from "@/utils/calculationUtils";


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);


const DEFAULT_PIE_COLORS = [
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#f1c40f",
    "#9b59b6",
    "#1abc9c",
    "#ffb300",
    "#6d28d9",
];

const makePieData = (obj = {}, colors = DEFAULT_PIE_COLORS, label = "") => ({
    labels: Object.keys(obj || {}),
    datasets: [
        {
            label,
            data: Object.values(obj || {}),
            backgroundColor: colors,
            borderWidth: 0,
        },
    ],
});


const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get("/optimized/analytics/raw-data");
                const calculatedStats = calculateAnalyticsStats(res.data);
                setAnalytics(calculatedStats);
            } catch (err) {
                console.error("Error fetching analytics:", err);
                try {
                    const res = await api.get("/analytics/overall");
                    setAnalytics(res.data);
                } catch (fallbackErr) {
                    console.error("Error with fallback analytics:", fallbackErr);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <LoadingDots />;
    if (!analytics || (
        Object.keys(analytics.attendeeLocations || {}).length === 0 &&
        Object.keys(analytics.ageGroups || {}).length === 0 &&
        Object.keys(analytics.interests || {}).length === 0
    )) {
        return (
            <div className="analytics-no-data">
                <div className="analytics-no-data-box">
                    No analytics data available for attendees.<br />
                    Please check back later or add some events and attendees.
                </div>
            </div>
        );
    }
    const locationBarData = {
        labels: Object.keys(analytics.attendeeLocations || {}),
        datasets: [
            {
                label: "Attendees",
                data: Object.values(analytics.attendeeLocations || {}),
                backgroundColor: [
                    "#3498db",
                    "#e74c3c",
                    "#2ecc71",
                    "#f1c40f",
                    "#9b59b6",
                    "#1abc9c",
                    "#ffb300",
                    "#6d28d9",
                    "#a78bfa",
                    "#e6fff7",
                ],
            },
        ],
    };
    const interestsPieData = makePieData(
        analytics.interests,
        ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c", "#ffb300", "#6d28d9", "#a78bfa", "#e6fff7"],
        "Interests"
    );

    const agesPieData = makePieData(
        analytics.ageGroups,
        ["#6d28d9", "#f1c40f", "#e74c3c", "#2ecc71", "#3498db", "#ffb300", "#9b59b6", "#1abc9c"],
        "Ages"
    );
    const statCards = [
        {
            label: "ATTENDEE AGE",
            value: analytics.attendeeAge,
            change: analytics.attendeeAgeChange,
            changeColor: analytics.attendeeAgeChange?.includes("decrease") ? "#e74c3c" : "#2ecc71",
            icon: <FaCalendarAlt />,
            number: analytics.attendeeAgeCount,
        },
        {
            label: "ATTENDEE GENDER",
            value: analytics.attendeeGender,
            change: analytics.attendeeGenderChange,
            changeColor: analytics.attendeeGenderChange?.includes("decrease") ? "#e74c3c" : "#2ecc71",
            icon: <FaRocket />,
            number: analytics.attendeeGenderCount,
        },
        {
            label: "ATTENDEE LOCATION",
            value: analytics.attendeeLocation,
            change: analytics.attendeeLocationChange,
            changeColor: analytics.attendeeLocationChange?.includes("decrease") ? "#e74c3c" : "#2ecc71",
            icon: <FaMapMarkerAlt />,
            number: analytics.attendeeLocationCount,
        },
        {
            label: "ATTENDEE INTERESTS",
            value: analytics.attendeeInterest,
            change: analytics.attendeeInterestChange,
            changeColor: analytics.attendeeInterestChange?.includes("decrease") ? "#e74c3c" : "#2ecc71",
            icon: <FaImage />,
            number: analytics.attendeeInterestCount,
        },
    ];

    return (
        <div className="attendee-insights-dashboard">
            <div className="dashboard-header-row">
                <h2>
                    <FaUsers /> All Attendee Insights
                </h2>
            </div>

            <div className="dashboard-main-grid">
                <div className="dashboard-left-cards dashboard-left-cards-gap">
                    {statCards.map((card) => (
                        <StatCard key={card.label} title={card.label} value={card.value} icon={card.icon} />
                    ))}
                </div>

                <div className="dashboard-charts-grid">
                    <div className="dashboard-chart dashboard-bar">
                        <h3>ALL ATTENDEE LOCATIONS</h3>
                        <div className="chart-content">
                            <Bar
                                data={locationBarData}
                                options={{
                                    plugins: { legend: { display: false } },
                                    indexAxis: "x",
                                    barThickness: 32,
                                    maxBarThickness: 40,
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: { y: { beginAtZero: true } },
                                }}
                            />
                        </div>
                    </div>

                    <div className="dashboard-pie-charts">
                        <div className="dashboard-chart dashboard-pie">
                            <h3>ATTENDEE INTERESTS</h3>
                            <div className="chart-content">
                                <Pie
                                    data={interestsPieData}
                                    options={{
                                        cutout: "70%",
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: "left" } },
                                    }}
                                />
                            </div>
                        </div>

                        <div className="dashboard-chart dashboard-pie">
                            <h3>ATTENDEE AGES</h3>
                            <div className="chart-content Ages">
                                <Pie
                                    data={agesPieData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: "left" } },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
