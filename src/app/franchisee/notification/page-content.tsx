import AppLayout from "@/components/app-layout";
import HeaderPage from "@/components/header";
import Image from 'next/image';


const notifications = [
  {
    title: 'Verifikasi Formulir Berhasil',
    message: 'Selamat formulirmu diterima',
    date: '03 Des',
    image: '/assets/highfive.svg',
  },
  {
    title: 'Jadwal Sesi Wawancara',
    message: 'Jadwal sesi wawancara sudah ditentukan',
    date: '03 Des',
    image: '/assets/highfive.svg',
  },
  {
    title: 'Hasil Akhir Permodalan',
    message: 'Selamat pengajuan modalmu diterima',
    date: '03 Des',
    image: '/assets/highfive.svg',
  },
  {
    title: 'Lengkapi Dokumen MoU',
    message: 'Ayoo lengkapi dokumen MoU, agar segera diproses',
    date: '03 Des',
    image: '/assets/highfive.svg',
  },
];

function NotificationPage() {
  return (
    <AppLayout>
    <HeaderPage title="Notifications" />
      <div className="px-4 py-6 space-y-4">
        {notifications.map((notif, idx) => (
          <div
            key={idx}
            className="bg-gray-100 rounded-xl flex items-start gap-4 p-4 justify-between"
          >
             <div className="flex-shrink-0">
                <Image
                    src="/image/franchisee/request-funding/request-funding-4.png"
                    alt="notification icon"
                    width={48}
                    height={48}
                    className="w-12 h-12"
                />
            </div>
            <div className="flex items-start gap-4">
              <div>
                <h2 className="font-semibold text-base text-gray-900">{notif.title}</h2>
                <p className="text-sm text-gray-700">{notif.message}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">{notif.date}</span>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
export default NotificationPage;