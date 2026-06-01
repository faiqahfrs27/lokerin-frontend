interface DevHeroProps {
  kicker: string;
  title: string;
  stats?: string[];
  action?: React.ReactNode;
}

function DevHero({ kicker, title, stats, action }: DevHeroProps) {
  return (
    <div className="dev-hero">
      <div className="dev-hero__text">
        <p className="dev-hero__kicker">{kicker}</p>
        <h1 className="dev-hero__title">{title}</h1>
        {stats && stats.length > 0 && <HeroStats items={stats} />}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function HeroStats({ items }: { items: string[] }) {
  return (
    <p className="dev-hero__subtitle">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span>·</span>}
          {item}
        </span>
      ))}
    </p>
  );
}

export default DevHero;