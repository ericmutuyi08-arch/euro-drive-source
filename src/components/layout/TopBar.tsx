import { Link } from 'react-router-dom';

const TopBar = () => {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 text-xs font-medium tracking-wide uppercase">
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="opacity-50">|</span>
          <Link to="/login" className="hover:underline">My Account</Link>
          <span className="opacity-50">|</span>
          <Link to="/contact" className="hover:underline">Contact Us</Link>
        </div>
        <div className="hidden sm:block font-bold tracking-widest">
          USED CAR PARTS
        </div>
      </div>
    </div>
  );
};

export default TopBar;
