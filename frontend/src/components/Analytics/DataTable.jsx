import React from "react";
const DataTable = ({ title, data }) => (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24, minWidth: 220 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>{title}</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    <th style={{ textAlign: "left", padding: 8 }}>Location</th>
                    <th style={{ textAlign: "right", padding: 8 }}>Count</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(data).map(([loc, count]) => (
                    <tr key={loc}>
                        <td style={{ padding: 8 }}>{loc}</td>
                        <td style={{ padding: 8, textAlign: "right" }}>{count}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
export default DataTable;
