import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

/**
 * Charts Component
 * Renders Pie chart (by department) and Bar chart (by status)
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
        <p className="font-semibold text-gray-700 text-sm">{label || payload[0].name}</p>
        <p className="text-blue-600 font-bold">{payload[0].value} complaints</p>
      </div>
    );
  }
  return null;
};

const Charts = ({ stats }) => {
  if (!stats) return null;

  const deptData = (stats.byDepartment || []).filter(d => d.value > 0);
  const statusData = stats.byStatus
    ? Object.entries(stats.byStatus)
        .map(([name, value]) => ({ name, value }))
        .filter(d => d.value > 0)   // hide zero-count statuses from chart
    : [];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Pie Chart — Department Distribution */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Complaints by Department</h3>
        {deptData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deptData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                dataKey="value"
                nameKey="name"
                labelLine={false}
                label={renderCustomLabel}
              >
                {deptData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar Chart — Status Distribution */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Complaints by Status</h3>
        {statusData.every(d => d.value === 0) ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Complaints" radius={[6, 6, 0, 0]}>
                {statusData.map((entry, index) => {
                  const colorMap = {
                    Submitted:      '#0B2E59', // Primary Navy Blue
                    Pending:        '#F59E0B', // Warning Amber
                    'Under Review': '#163E72', // Secondary Blue
                    Assigned:       '#2b67ad', // Light Navy
                    'In Progress':  '#4f46e5', // Indigo
                    Resolved:       '#16A34A', // Success Green
                    Closed:         '#6B7280', // Slate Gray
                    Rejected:       '#DC2626', // Error Red
                  };
                  return <Cell key={`bar-${index}`} fill={colorMap[entry.name] || '#163E72'} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Charts;
