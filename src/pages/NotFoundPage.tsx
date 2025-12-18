import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-[#675de6] mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Sayfa Bulunamadı</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button>
              <Home className="w-5 h-5 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          <Button variant="secondary" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri Git
          </Button>
        </div>
      </div>
    </div>
  );
}
