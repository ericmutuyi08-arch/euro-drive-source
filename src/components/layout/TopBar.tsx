import { Link } from 'react-router-dom';

const TopBar = () => {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto flex items-center justify-between px-4 py-1.5 text-xs tracking-wide">
        <div className="flex items-center gap-3">
          <Link to="/" className="hover:underline font-medium">Home</Link>
          <span className="opacity-50">|</span>
          <Link to="/login" className="hover:underline font-medium">My account</Link>
          <span className="opacity-50">|</span>
          <Link to="/contact" className="hover:underline font-medium">Contact us</Link>
        </div>
        <div className="hidden sm:block font-bold tracking-widest uppercase text-sm">
          USED CAR PARTS
        </div>
      </div>
    </div>
  );
};

export default TopBar;
