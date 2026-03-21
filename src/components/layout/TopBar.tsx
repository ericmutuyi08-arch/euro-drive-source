import { Link } from 'react-router-dom';

const TopBar = () => {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between py-1.5 text-xs tracking-wide">
          <div className="flex items-center gap-3">
            <Link to="/" className="hover:underline font-medium">Home</Link>
            <span className="opacity-50">|</span>
            <Link to="/account" className="hover:underline font-medium">My account</Link>
            <span className="opacity-50">|</span>
            <Link to="/contact" className="hover:underline font-medium">Contact us</Link>
          </div>
          <div className="font-bold tracking-widest uppercase text-sm">
            USED CAR PARTS
          </div>
        </div>
        {/* Mobile */}
        <div className="md:hidden py-2 text-center">
          <span className="font-bold tracking-widest uppercase text-sm">USED CAR PARTS</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
