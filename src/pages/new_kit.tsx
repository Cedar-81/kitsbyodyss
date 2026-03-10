import Input from "../components/input";
import ImageSelector from "../components/img_selector";
import { OverviewAPI, uploadImage } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { currencyCodes } from "../utils/helpers";
import { addToast } from "@heroui/toast";
import { useKitStore } from "../utils/store/app_store";
import { supabase } from "../utils/supabase";

export default function NewKit() {
  // const { id } = useParams();
  const navigate = useNavigate();
  
  const { kitFormData, kitLoading, updateKitFormField, setCurrentKitId, currentKitId, updateKitImages, updateKitImageFiles, resetKitForm, setIsUpdating, isUpdating, setKitLoading } = useKitStore();

  

  const handleAdd = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    // logout if no user
    if (!user) {
      addToast({ title: "You must be logged in to create a kit!", color: "danger" });
      return;
    }
    setKitLoading(true);
    console.log("description", kitFormData.description);
    try {
      const urls: string[] = [...kitFormData.images];
      // upload any new files
      await Promise.all(
        kitFormData.imageFiles.map(async (file, i) => {
          if (file) {
            const url = await uploadImage(file);
            urls[i] = url;
          }
        })
      );

      const payload: any = {
        user_id: user?.id,
        title: kitFormData.name,
        price: kitFormData.access_price,
        budget: kitFormData.trip_price,
        budget_currency_code: kitFormData.budget_currency_code,
        price_currency_code: kitFormData.access_currency_code,
        location: kitFormData.location,
        duration: kitFormData.trip_duration,
        duration_time_frame: kitFormData.trip_duration_time_frame,
        overview: kitFormData.description,
        main_image: urls[0],
        images: urls.splice(1).filter((u) => u) // remove empty strings,
      };

      console.log("payload", payload);

      let res;
      if (isUpdating && currentKitId) {
        res = await OverviewAPI.update(currentKitId, payload);
      } else {
        res = await OverviewAPI.create(payload);
      }

      if (res.error) {
        console.error(res.error);
        addToast({title: isUpdating ? 'Failed to update kit.' : 'Failed to create kit.', color: "danger" });
        // alert();
      } else {
        resetKitForm();
        addToast({title: isUpdating ? "Kit updated successfully!" : "Kit created successfully!", color: "success" });
        if (isUpdating) {
          setIsUpdating(false);
          setCurrentKitId(null);
        }
        navigate(`/${res.data.id}`);;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setKitLoading(false);
    }
  };

  return (
    <div className="px-5 space-y-4 w-full">
      <h1 className="font-medium text-lg pt-8 pb-2">Create New Kit</h1>
      <div className="w-full">
        <ImageSelector
          onChange={(v) => updateKitImages(0, v || "")}
          onChangeFile={(f) => updateKitImageFiles(0, f)} 
          previewClassName="h-32"
          className="mb-2"
        />
        {/* <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-min overflow-hidden">
              <ImageSelector
                onChange={(v) => updateKitImages(i, v || "")}
                onChangeFile={(f) => updateKitImageFiles(i, f)}
                previewClassName="h-32"
                className="h-32"
              />
            </div>
          ))}
        </div> */}
      </div>
      <Input type="text" placeholder='e.g. Beach Trip' title='Kit Name' titled value={kitFormData.name} onChangeInput={(e) => updateKitFormField('name', e.target.value)} />
      <Input placeholder="e.g N200000" titled title="Trip Budget" value={kitFormData.trip_price} optionsLeft={currencyCodes} onSelectLeft={(v) => updateKitFormField('budget_currency_code', v)} onChangeInput={(e) => updateKitFormField('trip_price', e.target.value)} />
      <Input placeholder="e.g N5000" titled title="Access Price" value={kitFormData.access_price} optionsLeft={currencyCodes} defaultSelectedLeft={kitFormData.access_currency_code || ""} onSelectLeft={(v) => updateKitFormField('access_currency_code', v)} onChangeInput={(e) => updateKitFormField('access_price', e.target.value)} />
      <Input type="text" placeholder='e.g. Victoria Island, Lagos' title='Trip Destination' titled value={kitFormData.location} onChangeInput={(e) => updateKitFormField('location', e.target.value)} />
      <Input type="text" placeholder='e.g. 3 days' options={["hours", "days", "weeks", "months", "years"]} title='Trip Duration' value={kitFormData.trip_duration} titled onChangeInput={(e) => updateKitFormField('trip_duration', e.target.value)} defaultSelectedRight={kitFormData.trip_duration_time_frame || ""} onSelectRight={(v) => updateKitFormField('trip_duration_time_frame', v)} />
      <Input type="text" placeholder='e.g. Beach Trip' textarea title='Kit Description' titled value={kitFormData.description} onChangeInput={(e) => updateKitFormField('description', e.target.value)} />
      <button onClick={handleAdd} disabled={kitLoading} className="w-full py-3 text-center bg-brand text-white rounded-xl my-3 mb-5">{kitLoading ? (isUpdating ? 'Updating...' : 'Adding...') : (isUpdating ? 'Update' : 'Add')}</button>
      
    </div>
  )
}
