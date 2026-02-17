import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

interface MobilePromoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobilePromoModal({ open, onOpenChange }: MobilePromoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icons.smartphone className="h-5 w-5 text-primary" />
            Téléchargez l'application mobile
          </DialogTitle>
          <DialogDescription>
            Accédez à vos finances partout avec Monely Mobile.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="bg-gray-100 p-4 rounded-full">
            <Icons.smartphone className="h-12 w-12 text-gray-500" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Choisissez votre plateforme pour télécharger l'application.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Button 
                className="w-full h-12 text-md font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all transform hover:scale-[1.02]" 
                onClick={() => window.open('/release/monely-v1.apk', '_blank')}
            >
              <Icons.play className="mr-2 h-5 w-5" />
              Télécharger pour Android
            </Button>
            
            <Button 
                className="w-full h-12 text-md font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all transform hover:scale-[1.02]" 
                variant="outline" 
                onClick={() => alert("La version iOS est en cours de validation sur l'App Store. Elle sera bientôt disponible !")}
            >
              <Icons.apple className="mr-2 h-5 w-5" />
              Télécharger pour iOS
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground pt-4 italic">
            make by Bhildiamants
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
