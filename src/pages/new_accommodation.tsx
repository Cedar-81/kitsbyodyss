import { useEffect } from 'react'
import ImageSelector from '../components/img_selector'
import Input from '../components/input'
import NoteInput from '../components/note_input'
import { currencyCodes } from '../utils/helpers'
import { useParams, useNavigate } from 'react-router-dom'
import { AccommodationAPI, uploadImage } from '../utils/api'
import { supabase } from '../utils/supabase'
import { useAccommodationStore } from '../utils/store/app_store'
import { addToast } from '@heroui/toast'

export default function NewAccommodation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { accommodationFormData, accommodationLoading, updateAccommodationFormField, resetAccommodationForm, setAccommodationLoading, isUpdating, currentAccommodationId, setIsUpdating, setCurrentAccommodationId } = useAccommodationStore();

  // reset form when switching to create mode
  useEffect(() => {
    if (!isUpdating) resetAccommodationForm();
  }, [isUpdating, id]);


  const handleSubmit = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!id) return;
    setAccommodationLoading(true);
    try {
      let imageUrl: string | null = accommodationFormData.image ?? null;
      if (accommodationFormData.imageFile) {
        imageUrl = await uploadImage(accommodationFormData.imageFile);
      }

      const payload: any = {
        overview_id: id,
        name: accommodationFormData.name,
        location: accommodationFormData.location,
        landmark: accommodationFormData.landmark,
        booking_link: accommodationFormData.booking_link,
        price: accommodationFormData.price ? Number(accommodationFormData.price) : null,
        currency_code: accommodationFormData.currency_code,
        duration: accommodationFormData.frequency,
        rating: accommodationFormData.rating,
        review: accommodationFormData.review,
        notes: accommodationFormData.notes,
        image: imageUrl,
        user_id: user?.id,
      };

      let res;
      if (isUpdating && currentAccommodationId) {
        res = await AccommodationAPI.update(currentAccommodationId, payload);
      } else {
        res = await AccommodationAPI.create(payload);
      }

      if (res.error) {
        console.error(res.error);
        addToast({ title: isUpdating ? 'Failed to update accommodation.' : 'Failed to add accommodation.', color: 'danger' });
      } else {
        resetAccommodationForm();
        if (isUpdating) {
          setIsUpdating(false);
          setCurrentAccommodationId(null);
        }
        navigate(`/${id}/accommodation`);
        addToast({ title: isUpdating ? 'Accommodation updated!' : 'New accommodation added!', color: 'success' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAccommodationLoading(false);
    }
  };

  return (
    <div className="px-5 space-y-4">
        <h1 className="font-medium text-lg pt-8 pb-2">{isUpdating ? 'Edit Accommodation' : 'Add New Accommodation'}</h1>
        <ImageSelector onChange={(img) => updateAccommodationFormField('image', img)} onChangeFile={(f) => updateAccommodationFormField('imageFile', f)} />
        <Input placeholder="e.g Chevron Restaurant" title="Name" titled value={accommodationFormData.name} onChangeInput={(e) => updateAccommodationFormField('name', e.target.value)} />
        <Input placeholder="e.g Cheveron Garage, Lagos" title="Location" titled value={accommodationFormData.location} onChangeInput={(e) => updateAccommodationFormField('location', e.target.value)} />
        <Input placeholder="e.g Near Chevron Garage" title="Landmark" titled value={accommodationFormData.landmark} onChangeInput={(e) => updateAccommodationFormField('landmark', e.target.value)} />
        <Input placeholder="e.g https://booking.com/..." title="Booking Link" titled value={accommodationFormData.booking_link} onChangeInput={(e) => updateAccommodationFormField('booking_link', e.target.value)} />
        <Input placeholder="e.g 2000" title="Price" type="number" optionsLeft={currencyCodes} options={["/hour", "/day", "/month", "/year"]} titled value={accommodationFormData.price || ''} onChangeInput={(e) => updateAccommodationFormField('price', e.target.value)} onSelectLeft={(val) => updateAccommodationFormField('currency_code', val)} onSelectRight={(val) => updateAccommodationFormField('frequency', val)} defaultSelectedLeft={accommodationFormData.currency_code} defaultSelectedRight={accommodationFormData.frequency ?? undefined} />
        <Input dropdown_only title="Rating" options={["1","2","3","4","5"]} titled onSelectRight={(val) => updateAccommodationFormField('rating', val)} defaultSelectedRight={accommodationFormData.rating ?? undefined} />
        <NoteInput initialNotes={accommodationFormData.notes} onChange={(n) => updateAccommodationFormField('notes', n)} />
        <div className='mt-6 space-y-4'>
            <div className='flex items-center justify-between'>
                <h2 className='text-base font-medium'>Review</h2>
            </div>
            <Input placeholder="Write your review here..." type="text" value={accommodationFormData.review} onChangeInput={(e) => updateAccommodationFormField('review', e.target.value)} />
        </div>
        <button onClick={handleSubmit} disabled={accommodationLoading} className="w-full py-3 cursor-pointer text-center bg-brand text-white rounded-xl my-3 mb-5">{accommodationLoading ? (isUpdating ? 'Updating...' : 'Adding...') : (isUpdating ? 'Update' : 'Add')}</button>
    </div>
  )
}
