import { Loader } from 'lucide-react';

const Spinner = () => {
  return (
    <div className="animate-spin">
      <Loader size={16} />
    </div>
  );
};

export default Spinner;
