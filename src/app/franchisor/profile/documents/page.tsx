// "use client";

// import AppLayout from "@/components/app-layout";
// import HeaderPage from "@/components/header";
// import { Button } from "@/components/ui/button";
// import {
//   ArrowLeft,
//   FileText,
//   Upload,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Download,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";

// export default function DocumentsPage() {
//   const router = useRouter();
//   const [documents] = useState([
//     {
//       id: 1,
//       name: "KTP",
//       description: "Kartu Tanda Penduduk",
//       status: "approved",
//       uploadedAt: "2024-01-15",
//       fileUrl: "/documents/ktp.pdf",
//     },
//     {
//       id: 2,
//       name: "NPWP",
//       description: "Nomor Pokok Wajib Pajak",
//       status: "pending",
//       uploadedAt: "2024-01-20",
//       fileUrl: "/documents/npwp.pdf",
//     },
//     {
//       id: 3,
//       name: "SIUP",
//       description: "Surat Izin Usaha Perdagangan",
//       status: "rejected",
//       uploadedAt: "2024-01-18",
//       fileUrl: "/documents/siup.pdf",
//       rejectReason: "Dokumen tidak jelas, silakan upload ulang",
//     },
//     {
//       id: 4,
//       name: "Surat Keterangan Domisili",
//       description: "Surat Keterangan Domisili Usaha",
//       status: "not_uploaded",
//       uploadedAt: null,
//       fileUrl: null,
//     },
//   ]);

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "approved":
//         return <CheckCircle className="w-5 h-5 text-green-500" />;
//       case "pending":
//         return <Clock className="w-5 h-5 text-yellow-500" />;
//       case "rejected":
//         return <XCircle className="w-5 h-5 text-red-500" />;
//       default:
//         return <Upload className="w-5 h-5 text-gray-400" />;
//     }
//   };

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case "approved":
//         return "Disetujui";
//       case "pending":
//         return "Menunggu Review";
//       case "rejected":
//         return "Ditolak";
//       default:
//         return "Belum Upload";
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "approved":
//         return "bg-green-100 text-green-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "rejected":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const handleUpload = (documentId: number) => {
//     // Simulate file upload
//     toast.success("Fitur upload akan segera tersedia");
//   };

//   const handleDownload = (document: any) => {
//     if (document.fileUrl) {
//       toast.success(`Mengunduh ${document.name}...`);
//       // In real app, trigger download
//     }
//   };

//   return (
//     <AppLayout>
//       <div className="min-h-screen bg-gray-50">
//         {/* Header */}
//         <HeaderPage title="KELENGKAPAN DOKUMEN" />

//         {/* Back Button */}
//         <div className="px-4 -mt-6 relative z-10 mb-4">
//           <Button
//             variant="ghost"
//             onClick={() => router.back()}
//             className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Kembali</span>
//           </Button>
//         </div>

//         {/* Documents Content */}
//         <div className="px-4">
//           {/* Progress Summary */}
//           <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               Progress Dokumen
//             </h3>
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-gray-600">Dokumen Lengkap</span>
//               <span className="font-medium text-[#EF5A5A]">
//                 {documents.filter((d) => d.status === "approved").length} dari{" "}
//                 {documents.length}
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//               <div
//                 className="bg-[#EF5A5A] h-2 rounded-full transition-all duration-300"
//                 style={{
//                   width: `${
//                     (documents.filter((d) => d.status === "approved").length /
//                       documents.length) *
//                     100
//                   }%`,
//                 }}
//               ></div>
//             </div>
//           </div>

//           {/* Documents List */}
//           <div className="space-y-3">
//             {documents.map((document) => (
//               <div
//                 key={document.id}
//                 className="bg-white rounded-lg p-4 shadow-sm"
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-3 mb-2">
//                       <FileText className="w-5 h-5 text-gray-400" />
//                       <div>
//                         <h4 className="font-medium text-gray-900">
//                           {document.name}
//                         </h4>
//                         <p className="text-sm text-gray-500">
//                           {document.description}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-2 mb-2">
//                       {getStatusIcon(document.status)}
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                           document.status
//                         )}`}
//                       >
//                         {getStatusText(document.status)}
//                       </span>
//                     </div>

//                     {document.uploadedAt && (
//                       <p className="text-xs text-gray-400">
//                         Upload:{" "}
//                         {new Date(document.uploadedAt).toLocaleDateString(
//                           "id-ID"
//                         )}
//                       </p>
//                     )}

//                     {document.status === "rejected" &&
//                       document.rejectReason && (
//                         <div className="mt-2 p-2 bg-red-50 rounded border-l-4 border-red-400">
//                           <p className="text-sm text-red-700">
//                             {document.rejectReason}
//                           </p>
//                         </div>
//                       )}
//                   </div>

//                   <div className="flex flex-col space-y-2">
//                     {document.status === "not_uploaded" ||
//                     document.status === "rejected" ? (
//                       <Button
//                         size="sm"
//                         onClick={() => handleUpload(document.id)}
//                         className="bg-[#EF5A5A] hover:bg-[#e44d4d]"
//                       >
//                         <Upload className="w-4 h-4 mr-1" />
//                         Upload
//                       </Button>
//                     ) : (
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleDownload(document)}
//                       >
//                         <Download className="w-4 h-4 mr-1" />
//                         Download
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Help Section */}
//           <div className="bg-blue-50 rounded-lg p-4 mt-6 border border-blue-200">
//             <h4 className="font-medium text-blue-900 mb-2">
//               Panduan Upload Dokumen
//             </h4>
//             <ul className="text-sm text-blue-800 space-y-1">
//               <li>• Format file: PDF, JPG, PNG (max 2MB)</li>
//               <li>• Pastikan dokumen jelas dan dapat dibaca</li>
//               <li>• Dokumen harus masih berlaku</li>
//               <li>• Jika ditolak, perbaiki sesuai keterangan</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }
