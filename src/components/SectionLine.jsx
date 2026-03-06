import useMobile from '../hooks/useMobile';

const SectionLine = ({ config }) => {
  const isMobile = useMobile(768);
  const activeConfig = isMobile ? config.mobile : config.desktop;
  const pathData = activeConfig.path.replace(/[zZ]\s*$/, '');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={activeConfig.viewBox}
      className="svg-line"
      aria-hidden="true"
    >
      <path fill="#f6b823" d={pathData} />
    </svg>
  );
};

export default SectionLine;
