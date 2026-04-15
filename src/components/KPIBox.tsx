interface KPIBoxProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'amber';
}

export function KPIBox({ label, value, icon, color = 'blue' }: KPIBoxProps) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        {icon && <div className="text-3xl opacity-40">{icon}</div>}
      </div>
    </div>
  );
}
