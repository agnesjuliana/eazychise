// components/InstallButton.tsx
<<<<<<< Updated upstream
import { useEffect, useState } from "react";
=======
import { useEffect, useState } from 'react';
>>>>>>> Stashed changes

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
<<<<<<< Updated upstream
    outcome: "accepted" | "dismissed";
=======
    outcome: 'accepted' | 'dismissed';
>>>>>>> Stashed changes
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallButton = () => {
<<<<<<< Updated upstream
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
=======
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
>>>>>>> Stashed changes
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

<<<<<<< Updated upstream
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
=======
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
>>>>>>> Stashed changes
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log(`User response to the install prompt: ${outcome}`);
    }
  };

  return (
    <>
      {isInstallable && (
<<<<<<< Updated upstream
        <button
          onClick={handleInstallClick}
=======
        <button 
          onClick={handleInstallClick} 
>>>>>>> Stashed changes
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 font-medium text-sm"
        >
          Install App
        </button>
      )}
    </>
  );
};

export default InstallButton;
