import { addToast } from "@heroui/toast";
import { UserAPI } from "../utils/api";
import { useProfileStore } from "../utils/store/app_store";
import Input from "./input";
import { useState } from "react";

export default function UserInfo({onClose}: {onClose: () => void}) {
    const [saving, setSaving] = useState(false)
    const {profile, setCurrentProfileId, setIsUpdating, updateProfileFormField, profileFormData, setProfile} = useProfileStore()

    console.log("profileData: ", profileFormData)
    
    
    
    const handleSave = async () => {
        if(profile?.id) {
            setSaving(true)
            addToast({title: "Updating profile...", color: "primary"})

            const res = await UserAPI.update(profile.id, {
                username: profileFormData.username,
                display_name: profileFormData.display_name,
                user_id: profile.user_id,
            })

            setProfile({
                username: res.data.username,
                display_name: res.data.display_name,
                id: res.data.id,
                user_id: res.data.user_id
            })

            console.log("response: ", res)

            if(res.error){
                setSaving(false)
                addToast({title: "Couldn't update your profile!", color: "danger"})
            }else{
                setSaving(false)
                setIsUpdating(false);
                setCurrentProfileId(null);
                addToast({title: "Profile updated successfully.", color: "success"})
                onClose()
            }
        }
    }

  return (
    <div onClick={onClose} className="fixed top-0 right-0 h-screen flex items-center justify-center p-8 w-full bg-black/70 z-50">
        <div onClick={e => e.stopPropagation()} className="w-full p-6 md:w-100 rounded-2xl bg-white space-y-5 border border-brand/70">
            <h1 className="text-center font-medium text-xl">Your info</h1>
            <div className="space-y-3">
                <Input placeholder="e.g Rex Luther" titled value={profileFormData?.display_name} onChangeInput={e => updateProfileFormField("display_name", e.target.value)} title="Display name" />
                <Input placeholder="e.g lurex" titled value={profileFormData?.username} onChangeInput={e => updateProfileFormField("username", e.target.value)} title="Username" />
            </div>
            <button onClick={handleSave} disabled={saving} className="h-11 w-full disabled:bg-brand/50 text-center bg-brand rounded-full text-white">{saving ? "Saving..." : "Save"}</button>
        </div>
    </div>
  )
}
