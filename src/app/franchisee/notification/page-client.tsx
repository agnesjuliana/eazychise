'use client';

import withAuth from '@/lib/withAuth';
import NotificationPage from './page-content'; // atau isi komponen notifikasinya langsung

export default withAuth(NotificationPage, 'FRANCHISEE');
