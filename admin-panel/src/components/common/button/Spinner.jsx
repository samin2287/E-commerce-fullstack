import { FiLoader } from "react-icons/fi";

const Spinner = ({ className = "h-4 w-4" }) => {
  return <FiLoader className={`${className} animate-spin`} />;
};

export default Spinner;
