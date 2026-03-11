import { useEffect } from 'react'
import ImageSelector from '../components/img_selector'
import Input from '../components/input'
import NoteInput from '../components/note_input'
import { currencyCodes } from '../utils/helpers'
import { useParams, useNavigate } from 'react-router-dom'
import { ActivitiesAPI, uploadImage } from '../utils/api'
import { supabase } from '../utils/supabase'
import { useActivityStore } from '../utils/store/app_store'
import { addToast } from '@heroui/toast'

export default function NewActivity() {
  const { id, user_id } = useParams();
  const navigate = useNavigate();

  const { activityFormData, activityLoading, updateActivityFormField, resetActivityForm, setActivityLoading, isUpdating, currentActivityId, setIsUpdating, setCurrentActivityId } = useActivityStore();

  useEffect(() => {
    if (!isUpdating) resetActivityForm();
  }, [isUpdating, id]);

  // useEffect(() => () => {
  //   setIsUpdating(false);
  //   setCurrentActivityId(null);
  // }, []);

  console.log("activity form data: ", activityFormData, isUpdating, currentActivityId);

  const handleSubmit = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!id) return;
    setActivityLoading(true);
    try {
      let imageUrl: string | null = activityFormData.image ?? null;
      if (activityFormData.imageFile) {
        imageUrl = await uploadImage(activityFormData.imageFile);
      }

      const payload: any = {
        overview_id: id,
        name: activityFormData.name,
        location: activityFormData.location,
        landmark: activityFormData.landmark,
        booking_link: activityFormData.booking_link,
        price: activityFormData.price ? Number(activityFormData.price) : null,
        currency_code: activityFormData.currency_code,
        duration: activityFormData.frequency,
        rating: activityFormData.rating,
        review: activityFormData.review,
        notes: activityFormData.notes,
        user_id: user?.id,
        image: imageUrl,
      };

      let res;
      if (isUpdating && currentActivityId) {
        res = await ActivitiesAPI.update(currentActivityId, payload);
      } else {
        res = await ActivitiesAPI.create(payload);
      }

      if (res.error) {
        console.error(res.error);
        addToast({ title: isUpdating ? 'Failed to update activity.' : 'Failed to add activity.', color: 'danger' });
      } else {
        resetActivityForm();
        if (isUpdating) {
          setIsUpdating(false);
          setCurrentActivityId(null);
        }
        navigate(`/${user_id}/${id}/activities`);
        addToast({ title: isUpdating ? 'Activity updated!' : 'New activity added!', color: 'success' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActivityLoading(false);
    }
  };

  return (
    <div className="px-5 space-y-4 w-full">
        <h1 className="font-medium text-lg pt-8 pb-2">{isUpdating ? 'Edit Activity' : 'Add New Activity'}</h1>
        <ImageSelector onChange={(img) => updateActivityFormField('image', img)} onChangeFile={(f) => updateActivityFormField('imageFile', f)} />
        <Input placeholder="e.g Nestar Lakeside" title="Name" titled value={activityFormData.name} onChangeInput={(e) => updateActivityFormField('name', e.target.value)} />
        <Input placeholder="e.g Lakeside view lagos" title="Location" titled value={activityFormData.location} onChangeInput={(e) => updateActivityFormField('location', e.target.value)} />
        <Input placeholder="e.g Near Nestar Lake" title="Landmark" titled value={activityFormData.landmark} onChangeInput={(e) => updateActivityFormField('landmark', e.target.value)} />
        <Input placeholder="e.g https://booking.com/..." title="Booking Link" titled value={activityFormData.booking_link} onChangeInput={(e) => updateActivityFormField('booking_link', e.target.value)} />
        <Input placeholder="e.g 2000" title="Price" type="number" optionsLeft={currencyCodes} options={["/hour", "/day", "/month", "/year"]} titled value={activityFormData.price || ''} onChangeInput={(e) => updateActivityFormField('price', e.target.value)} onSelectLeft={(val) => updateActivityFormField('currency_code', val)} onSelectRight={(val) => updateActivityFormField('frequency', val)} defaultSelectedLeft={activityFormData.currency_code} defaultSelectedRight={activityFormData.frequency ?? undefined} />
        <Input dropdown_only title="Rating" options={["1","2","3","4","5"]} titled onSelectRight={(val) => updateActivityFormField('rating', val)} defaultSelectedRight={activityFormData.rating ?? undefined} />
        <NoteInput initialNotes={activityFormData.notes} onChange={(n) => updateActivityFormField('notes', n)} />
        <div className='mt-6 space-y-4'>
            <div className='flex items-center justify-between'>
                <h2 className='text-base font-medium'>Review</h2>
            </div>
            <Input placeholder="Write your review here..." type="text" value={activityFormData.review} onChangeInput={(e) => updateActivityFormField('review', e.target.value)} />
        </div>
        <button onClick={handleSubmit} disabled={activityLoading} className="w-full py-3 text-center bg-brand text-white rounded-xl my-3 mb-5">{activityLoading ? (isUpdating ? 'Updating...' : 'Adding...') : (isUpdating ? 'Update' : 'Add')}</button>
    </div>
  )
}
