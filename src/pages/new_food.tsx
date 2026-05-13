import { useEffect, useState } from "react";
import ImageSelector from "../components/img_selector";
import Input from "../components/input";
import NoteInput from "../components/note_input";
import { currencyCodes } from "../utils/helpers";
import { useParams, useNavigate } from "react-router-dom";
import { FoodAPI, OverviewAPI, uploadImage } from "../utils/api";
import { supabase } from "../utils/supabase";
import { useFoodStore, useProfileStore } from "../utils/store/app_store";
import { addToast } from "@heroui/toast";

export default function NewFood() {
  const { id, user_id } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfileStore();
  const [authorized, setAuthorized] = useState(false);
  const [_loading, setLoading] = useState(true);

  const { 
    foodFormData,
    foodLoading,
    updateFoodFormField,
    resetFoodForm,
    setFoodLoading,
    isUpdating,
    currentFoodId,
    setIsUpdating,
    setCurrentFoodId,
  } = useFoodStore();

  // Check authorization before allowing access to this page
  useEffect(() => {
    async function checkAuth() {
      if (!id) return;
      try {
        const res = await OverviewAPI.getById(id);
        if (res.data) {
          // Only the kit owner can create items
          const isOwner = res.data.user_id === profile?.user_id;
          setAuthorized(isOwner);
          if (!isOwner) {
            addToast({ title: "You don't have permission to add items to this kit", color: "danger" });
            // Redirect to the kit's food page
            navigate(`/${user_id}/${id}/food`);
          }
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        navigate(`/${user_id}/${id}/food`);
      }
    }
    checkAuth();
  }, [id, profile?.user_id, user_id, navigate]);

  // reset form only when entering create mode (not editing)
  useEffect(() => {
    if (!isUpdating && authorized) {
      resetFoodForm();
    }
  }, [id, isUpdating, authorized]);

  const handleSubmit = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!id) return;
    setFoodLoading(true);
    try {
      let imageUrl: string | null = foodFormData.image ?? null;
      if (foodFormData.imageFile) {
        // upload the file and get public url
        imageUrl = await uploadImage(foodFormData.imageFile);
      }

      const payload: any = {
        overview_id: id,
        name: foodFormData.name,
        location: foodFormData.location,
        booking_link: foodFormData.booking_link,
        price: foodFormData.price ? Number(foodFormData.price) : null,
        currency_code: foodFormData.currency_code,
        rating: foodFormData.rating,
        review: foodFormData.review,
        landmark: foodFormData.landmark,
        notes: foodFormData.notes,
        image: imageUrl,
        user_id: user?.id,
      };

      let res;

      if (isUpdating && currentFoodId) {
        res = await FoodAPI.update(currentFoodId, payload);
      } else {
        res = await FoodAPI.create(payload);
      }

      if (res.error) {
        console.error(res.error);
        addToast({ title: isUpdating ? "Failed to update food." : "Failed to add food.", color: "danger" });
      } else {
        resetFoodForm();
        // clear updating flags if we just edited
        if (isUpdating) {
          setIsUpdating(false);
          setCurrentFoodId(null);
        }
        navigate(`/${user_id}/${id}/food`);
        addToast({ title: isUpdating ? "Food updated!" : "New food added!", color: "success" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFoodLoading(false);
    }
  };

  return (
    <div className="px-5 space-y-4 w-full">
        <h1 className="font-medium text-lg pt-8 pb-2">
          {isUpdating ? "Edit Food Place" : "Add New Food Place"}
        </h1>
        <ImageSelector value={foodFormData.image} onChange={(img) => updateFoodFormField('image', img)} onChangeFile={(f) => updateFoodFormField('imageFile', f)} />
        <Input placeholder="e.g Rive Park Resturant" title="Name" titled value={foodFormData.name} onChangeInput={(e) => updateFoodFormField('name', e.target.value)} />
        <Input placeholder="Location" title="Location" titled value={foodFormData.location} onChangeInput={(e) => updateFoodFormField('location', e.target.value)} />
        <Input placeholder="e.g https://booking.com/..." title="Booking Link" titled value={foodFormData.booking_link} onChangeInput={(e) => updateFoodFormField('booking_link', e.target.value)} />
        <Input placeholder="e.g Near River Roundabout." title="Nearest Landmark" titled value={foodFormData.landmark} onChangeInput={(e) => updateFoodFormField('landmark', e.target.value)} />
        <Input placeholder="e.g 2000" title="Price" type="number" optionsLeft={currencyCodes} titled value={foodFormData.price || ''} onChangeInput={(e) => updateFoodFormField('price', e.target.value)} onSelectLeft={(val) => updateFoodFormField('currency_code', val)} defaultSelectedLeft={foodFormData.currency_code} />
        <Input dropdown_only title="Rating" options={["1","2","3","4","5"]} titled onSelectRight={(val) => updateFoodFormField('rating', val)} defaultSelectedRight={foodFormData.rating ?? undefined} />
        <NoteInput initialNotes={foodFormData.notes} onChange={(n) => updateFoodFormField('notes', n)} />
        <div className='mt-6 space-y-4'>
            <div className='flex items-center justify-between'>
                <h2 className='text-base font-medium'>Review</h2>
            </div>
            <Input placeholder="Write your review here..." type="text" value={foodFormData.review} onChangeInput={(e) => updateFoodFormField('review', e.target.value)} />
        </div>
        <button onClick={handleSubmit} disabled={foodLoading} className="w-full py-3 text-center bg-brand text-white rounded-xl my-3 mb-5">
          {foodLoading
            ? isUpdating
              ? 'Updating...'
              : 'Adding...'
            : isUpdating
            ? 'Update'
            : 'Add'}
        </button>
    </div>
  )
}
