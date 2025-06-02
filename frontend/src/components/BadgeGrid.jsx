// src/components/BadgeGrid.jsx
export default function BadgeGrid({ earned = [] }) {
  const allBadges = [
    { id: 1, name: 'Sprout Badge' },
    { id: 2, name: 'Spark Badge' },
    { id: 3, name: 'Drop Badge' },
    { id: 4, name: 'Flame Badge' },
    { id: 5, name: 'Cycle Badge' },
    { id: 6, name: 'Pedal Badge' },
    { id: 7, name: 'Heart Badge' },
    { id: 8, name: 'Solar Badge' },
    { id: 9, name: 'Planet Badge' }
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {allBadges.map((badge) => {
        const earnedBadge = earned.includes("Level " + badge.id);
        return (
          <div key={badge.id} className="flex flex-col items-center text-center">
            <img
              src={`/badges/${badge.id}.png`}
              alt={badge.name}
              className={`w-16 h-16 transition-all ${
                earnedBadge ? '' : 'opacity-30 blur-[2px]'
              }`}
            />
            <span className="text-xs mt-1">{badge.name}</span>
          </div>
        );
      })}
    </div>
  );
}
