import { Link } from 'react-router-dom';
import { Settings, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* The Society */}
          <div>
            <h3 className="text-primary font-bold uppercase text-sm mb-4 tracking-wider">The Society</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/about" className="hover:text-primary transition-colors">Who we are</Link></li>
              <li><Link to="/payment" className="hover:text-primary transition-colors">Payment methods</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Access Customers */}
          <div>
            <h3 className="text-primary font-bold uppercase text-sm mb-4 tracking-wider">Access Customers</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/login" className="hover:text-primary transition-colors">My account</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Quotes</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-primary font-bold uppercase text-sm mb-4 tracking-wider">Information</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-black uppercase text-sm">My Used Engine</p>
                <p className="text-primary font-bold text-xs">Since 2009</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-secondary-foreground/70">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>123 Industrial Zone, Paris, France</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>contact@myusedengine.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-secondary-foreground/50">
          © {new Date().getFullYear()} My Used Engine. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
