interface BenchmarkFactProps {
  label: string;
  city: string;
  value: string;
  note: string;
  source: string;
}

export default function BenchmarkFact({
  label,
  city,
  value,
  note,
  source,
}: BenchmarkFactProps) {
  return (
    <article className="benchmark-fact">
      <p className="panel-label">{label}</p>
      <div className="benchmark-fact-head">
        <h3>{city}</h3>
        <strong>{value}</strong>
      </div>
      <p>{note}</p>
      <p className="benchmark-source">{source}</p>
    </article>
  );
}
