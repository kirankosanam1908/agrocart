// frontend/src/components/StatusBadge.jsx
const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
