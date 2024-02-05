export const Rank = ({ name, entries }: { name: string; entries: number }) => {
  return (
    <div>
      <div className="text-white text-lg">
        {`${name}, your current entry count is ...`}
      </div>
      <div className="text-white text-xl">{entries}</div>
    </div>
  );
};

export default Rank;
