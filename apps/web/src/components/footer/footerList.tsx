type FooterListProps = {
  title?: String;
  children: React.ReactNode;
  className?: String
};

export default function FooterList({ title, children, className = "" }: FooterListProps) {
  return (
    <div>
      <p className="text-lg text-gray-700 mb-3">{title}</p>
      <ul className={`space-y-2 ${className}`}>{children}</ul>
    </div>
  );
}
