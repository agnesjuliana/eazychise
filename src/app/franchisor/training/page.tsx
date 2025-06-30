"use client";

import FranchisorLayout from "@/components/franchisor-layout";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import withAuth from "@/lib/withAuth";
import { ListingDocument } from "@/type/tutorial";
import { FileText, Plus, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function TutorialProduksiPage() {
  const router = useRouter();

  const [tutorials, setTutorials] = useState<ListingDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTutorials = async () => {
    try {
      const response = await fetch("/api/tutorials");
      const result = await response.json();
      console.log("Fetched tutorials result:", result);
      console.log("Result data:", result.data);
      console.log("Result data length:", result.data?.length);

      if (
        result.success === true ||
        result.status === true ||
        result.status === "success"
      ) {
        const tutorialData = result.data || [];
        console.log("Setting tutorials to:", tutorialData);
        setTutorials(tutorialData);
      } else {
        console.log("API call failed, setting empty array");
        setTutorials([]);
      }
    } catch (error) {
      console.log("Error in fetch, setting empty array");
      setTutorials([]);
      console.error("Error fetching tutorials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  const handleAddTutorial = () => {
    router.push("/franchisor/training/add");
  };

  const handleDocumentClick = (document: ListingDocument) => {
    window.open(document.path, "_blank");
  };

  const handleEditTutorial = (
    tutorial: ListingDocument,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent card click
    router.push(`/franchisor/training/edit/${tutorial.id}`);
  };

  return (
    <FranchisorLayout className="overflow-x-hidden">
      {/* Header */}
      <HeaderPage title="Tutorial Produksi" />

      <div className="p-4 space-y-4 pb-24">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Memuat tutorial...</p>
          </div>
        )}

        {/* List Tutorial dari API */}
        <div className="space-y-3">
          {tutorials && tutorials.length > 0 ? (
            tutorials.map((tutorial, idx) => {
              const docName = tutorial?.name || `Dokumen ${idx + 1}`;
              const docPath = tutorial?.path || "";
              const docId = tutorial?.id || docPath || `tutorial-${idx}`;
              // Ambil hanya nama file dari path
              const fileNameOnly = docPath.split("/").pop() || docPath;
              return (
                <Card
                  key={docId}
                  className="overflow-hidden shadow-sm cursor-pointer hover:bg-gray-50 transition-colors border border-[#EF5A5A] rounded-xl flex items-center px-2 py-1"
                  onClick={() =>
                    handleDocumentClick({
                      ...tutorial,
                      name: docName,
                      path: docPath,
                    })
                  }
                  style={{ minHeight: 56 }}
                >
                  <div className="flex items-center w-full">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <FileText className="w-6 h-6 text-[#EF5A5A]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-900 truncate">
                        {docName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {fileNameOnly}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleEditTutorial(tutorial, e)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        title="Edit Tutorial"
                      >
                        <Settings className="w-4 h-4 text-gray-600" />
                      </button>
                      {/* <Download className="w-5 h-5 text-gray-400 flex-shrink-0" /> */}
                    </div>
                  </div>
                </Card>
              );
            })
          ) : !loading ? (
            <div className="p-6 text-center text-gray-500">
              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm">Belum ada dokumen tutorial</p>
              <p className="text-xs text-gray-400 mt-1">
                Klik tombol + untuk menambah tutorial
              </p>
            </div>
          ) : null}
        </div>

        {/* Empty State if no categories */}
        {tutorials.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Belum Ada Tutorial
            </h3>
            <p className="text-gray-500 mb-4">
              Mulai buat tutorial produksi pertama Anda
            </p>
            <Button
              onClick={handleAddTutorial}
              className="bg-[#EF5A5A] hover:bg-[#c84d4d]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tutorial
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-50">
        <Button
          onClick={handleAddTutorial}
          className="w-14 h-14 rounded-full bg-[#EF5A5A] hover:bg-[#c84d4d] shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <Plus className="text-white size-8" />
        </Button>
      </div>
    </FranchisorLayout>
  );
}

export default withAuth(TutorialProduksiPage, "FRANCHISOR");
