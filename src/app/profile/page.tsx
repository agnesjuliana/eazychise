import AppLayout from '@/components/app-layout';

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6'>Profile</h1>

        <div className='space-y-4'>
          <div className='bg-white rounded-lg p-4 shadow-sm border'>
            <h2 className='text-lg font-semibold text-gray-800 mb-2'>
              User Profile
            </h2>
            <p className='text-gray-600'>Manage your account settings</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
