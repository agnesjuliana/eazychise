"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin-layout';
import HeaderPage from '@/components/header';
import withAuth from '@/lib/withAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Upload, Loader2, CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import { CreateEventPayload } from '@/type/event';

interface EventFormData {
  name: string;
  price: string;
  datetime: string;
  image: File | null;
}

function AddEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    price: '',
    datetime: '',
    image: null,
  });

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Nama event wajib diisi');
      return false;
    }

    if (!formData.price.trim()) {
      toast.error('Harga event wajib diisi');
      return false;
    }

    const priceNumber = parseInt(formData.price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      toast.error('Harga harus berupa angka positif');
      return false;
    }

    if (!formData.datetime.trim()) {
      toast.error('Tanggal dan waktu event wajib diisi');
      return false;
    }

    if (!formData.image) {
      toast.error('Gambar event wajib diupload');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare data for API
      const eventData = {
        name: formData.name.trim(),
        price: parseInt(formData.price.trim()),
        datetime: formData.datetime,
        image: formData.image ? `/images/events/${formData.image.name}` : '', // For now, use static path
      };

      // Call API to create event
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(data.message || data.error || 'Gagal menambahkan event');
      }

      toast.success('Event berhasil ditambahkan!');
      
      // Redirect to event management page
      router.push('/admin/event');

    } catch (error) {
      console.error('Error adding event:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menambahkan event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Fixed Header */}
      <div className="flex flex-col gap-4 fixed top-0 left-0 right-0 z-10 max-w-md mx-auto bg-gray-50 w-full">
        <HeaderPage title="Tambah Event" />
      </div>
      
      {/* Spacer untuk memberikan ruang agar konten tidak tertimpa header */}
      <div
        style={{ height: '140px' }}
        className="w-full bg-gray-50"
      ></div>

      {/* Konten Utama */}
      <div className="flex flex-col gap-4 w-full px-4 pb-10 pt-10">
        {/* Back Button - Dipindahkan ke dalam konten utama */}
        <div className="w-full">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 cursor-pointer"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali
          </Button>
        </div>

        {/* Content */}
        <div className="w-full">
        <Card className="p-6 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nama Event <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama event"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>

            {/* Event Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                Harga Event (Rp) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full"
                min="0"
                step="1"
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Masukkan 0 jika event gratis
              </p>
            </div>

            {/* Event Date & Time */}
            <div className="space-y-2">
              <Label htmlFor="datetime" className="text-sm font-medium text-gray-700">
                Tanggal & Waktu <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={formData.datetime}
                  onChange={(e) => handleInputChange('datetime', e.target.value)}
                  className="w-full pl-10"
                  disabled={loading}
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Event Image */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Gambar Event <span className="text-red-500">*</span>
              </Label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                    disabled={loading}
                  >
                    Hapus
                  </Button>
                </div>
              )}

              {/* Upload Area */}
              {!imagePreview && (
                <div className="w-full">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <Label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, atau JPEG (Max. 5MB)
                      </p>
                    </div>
                  </Label>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-[#EF5A5A] hover:bg-[#c84d4d] cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menambahkan Event...
                  </>
                ) : (
                  'Tambah Event'
                )}
              </Button>
            </div>
          </form>
        </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(AddEventPage, 'ADMIN');
