"use client";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import StepOne from "./components/StepOne";
import { Progress } from "@/components/ui/progress";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import StepFour from "./components/StepFour";
import StepFive from "./components/StepFive";
import StepSix from "./components/StepSix";
import StepEight from "./components/StepEight";
import StepNine from "./components/StepNine";
import StepSeven from "./components/StepSeven";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function RequestFundingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConditionalSteps, setShowConditionalSteps] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);

  const handleNext = () => {
    if (currentStep === 3) {
      // Show submit dialog for StepThree
      setShowSubmitDialog(true);
      return;
    }

    if (currentStep === 7) {
      // Show send dialog for StepSeven
      setShowSendDialog(true);
      return;
    }

    if (currentStep === 8) {
      // Progress to StepNine
      setCurrentStep(currentStep + 1);
      return;
    }

    if (currentStep === 9) {
      // Navigate to My Franchise for StepNine
      // Add navigation logic here
      console.log("Navigate to My Franchise");
      return;
    }

    // Normal progression
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 6) {
      // After step 6, check if conditional steps should be shown
      // This is where you can add logic to determine if steps 7-9 should be displayed
      setShowConditionalSteps(true);
      setCurrentStep(7); // Jump to step 7 (conditional steps don't use progress bar)
    } else if (showConditionalSteps) {
      // Handle progression through conditional steps 7-9
      if (currentStep < 9) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitConfirm = () => {
    setShowSubmitDialog(false);
    // Handle submit logic here
    console.log("Form submitted");
    setCurrentStep(currentStep + 1);
  };

  const handleSendConfirm = () => {
    setShowSendDialog(false);
    // Handle send logic here
    console.log("Documents sent");
    setCurrentStep(currentStep + 1);
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 3:
        return "Submit";
      case 4:
      case 5:
        return "Lihat Detail";
      case 6:
        return "Selanjutnya";
      case 7:
        return "Kirim";
      case 8:
        return "Kembali ke Home";
      case 9:
        return "Cek My Franchise";
      default:
        return "Selanjutnya";
    }
  };

  const showBackButton = () => {
    return currentStep === 2 || currentStep === 3;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour />;
      case 5:
        return <StepFive />;
      case 6:
        return <StepSix />;
      case 7:
        return <StepSeven />;
      case 8:
        return <StepEight />;
      case 9:
        return <StepNine />;
      default:
        return <StepOne />;
    }
  };

  return (
    <AppLayout showBottomNav={false} className="text-black">
      <Button variant="secondary" size="icon" className="size-8 mt-8 mb-2">
        <ArrowLeft />
      </Button>
      <section className="mb-12 px-4 flex min-h-screen h-auto w-full items-center justify-start flex-col">
        {/* Show progress bar only for steps 2-6, but map to progress steps 1-5 */}
        {!showConditionalSteps && currentStep >= 2 && currentStep <= 6 && (
          <Progress variant="steps" steps={5} currentStep={currentStep - 1} />
        )}

        {/* Render the current step */}
        {renderCurrentStep()}

        {/* Button Section */}
        <div className="w-full flex gap-3 mt-6">
          {showBackButton() && (
            <Button variant="outline" className="flex-1" onClick={handleBack}>
              Kembali
            </Button>
          )}
          <Button
            className={`${
              showBackButton() ? "flex-1" : "w-full"
            } bg-[#EF5A5A] hover:bg-[#e44d4d]`}
            onClick={handleNext}
          >
            {getButtonText()}
          </Button>
        </div>

        {/* Submit Dialog for StepThree */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Submit</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin mengirim formulir pendaftaran ini?
                Pastikan semua data yang diisi sudah benar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmitConfirm}
                className="bg-[#EF5A5A] hover:bg-[#e44d4d]"
              >
                Ya, Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Send Dialog for StepSeven */}
        <AlertDialog open={showSendDialog} onOpenChange={setShowSendDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Kirim Dokumen</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin mengirim dokumen MoU yang telah
                ditandatangani? Pastikan dokumen sudah diisi dengan benar dan
                dilengkapi materai.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSendConfirm}
                className="bg-[#EF5A5A] hover:bg-[#e44d4d]"
              >
                Ya, Kirim
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </AppLayout>
  );
}

export default RequestFundingPage;
