import { useEffect, useState } from 'react'
import Input from '../components/input'
import NoteInput from '../components/note_input'
import { currencyCodes } from '../utils/helpers'
import { useParams, useNavigate } from 'react-router-dom'
import { TransportationAPI, OverviewAPI } from '../utils/api'
import { supabase } from '../utils/supabase'
import { useTransportationStore, useProfileStore } from '../utils/store/app_store'
import { addToast } from '@heroui/toast'

export default function NewTransportation() {
	const { id, user_id } = useParams(); 
	const navigate = useNavigate();
	const { profile } = useProfileStore();
	const [authorized, setAuthorized] = useState(false);
	const [_loading, setLoading] = useState(true);

	const {
		transportationFormData,
		transportationLoading,
		updateTransportationFormField,
		resetTransportationForm,
		setTransportationLoading,
		isUpdating,
		currentTransportationId,
		setIsUpdating,
		setCurrentTransportationId,
	} = useTransportationStore();

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
						// Redirect to the kit's transportation page
						navigate(`/${user_id}/${id}/transportation`);
					}
				}
				setLoading(false);
			} catch (err) {
				setLoading(false);
				navigate(`/${user_id}/${id}/transportation`);
			}
		}
		checkAuth();
	}, [id, profile?.user_id, user_id, navigate]);

	useEffect(() => {
		if (!isUpdating && authorized) resetTransportationForm();
	}, [isUpdating, id, authorized]);

	const handleSubmit = async () => {
		const user = (await supabase.auth.getUser()).data.user;
		if (!id) return;
		setTransportationLoading(true);
		try {

			const payload: any = {
				overview_id: id,
				company: transportationFormData.company,
				location: transportationFormData.location,
				landmark: transportationFormData.landmark,
				from_city: transportationFormData.from_city,
				to_city: transportationFormData.to_city,
				from_state: transportationFormData.from_state,
				to_state: transportationFormData.to_state,
				from_country: transportationFormData.from_country,
				to_country: transportationFormData.to_country,
				mode: transportationFormData.mode,
				booking_link: transportationFormData.booking_link,
				price: transportationFormData.price ? Number(transportationFormData.price) : null,
				currency_code: transportationFormData.currency_code,
				duration: transportationFormData.duration,
				duration_time: transportationFormData.duration_time,
				rating: transportationFormData.rating,
				reviews: transportationFormData.review,
				notes: transportationFormData.notes,
				user_id: user?.id,
			};

			let res;
			if (isUpdating && currentTransportationId) {
				res = await TransportationAPI.update(currentTransportationId, payload);
			} else {
				res = await TransportationAPI.create(payload);
			}

			if (res.error) {
				console.error(res.error);
				addToast({ title: isUpdating ? 'Failed to update transportation.' : 'Failed to add transportation.', color: 'danger' });
			} else {
				resetTransportationForm();
				if (isUpdating) {
					setIsUpdating(false);
					setCurrentTransportationId(null);
				}
				navigate(`/${user_id}/${id}/transportation`);
				addToast({ title: isUpdating ? 'Transportation updated!' : 'New transportation added!', color: 'success' });
			}
		} catch (err) {
			console.error(err);
		} finally {
			setTransportationLoading(false);
		}
	};

	return (
		<div className="px-5 space-y-4 w-full lg:w-max lg:mx-auto">
			<h1 className="font-medium text-lg pt-8 pb-2">{isUpdating ? 'Edit Transportation' : 'Add New Transportation'}</h1>

			<Input placeholder="e.g Peace Mass Transit" title="Company" titled value={transportationFormData.company} onChangeInput={(e) => updateTransportationFormField('company', e.target.value)} />
			<Input placeholder="e.g Head office, Lagos" title="Company Location" titled value={transportationFormData.location} onChangeInput={(e) => updateTransportationFormField('location', e.target.value)} />
			<Input placeholder="e.g Near Lekki Roundabout" title="Landmark" titled value={transportationFormData.landmark} onChangeInput={(e) => updateTransportationFormField('landmark', e.target.value)} />

			<Input dropdown_only title="Mode" options={["Bus","Car","Train","Flight","Ferry","Taxi","Ride-share"]} titled onSelectRight={(val) => updateTransportationFormField('mode', val)} defaultSelectedRight={transportationFormData.mode || undefined} />

			<Input placeholder="e.g Lagos" title="From City" titled value={transportationFormData.from_city} onChangeInput={(e) => updateTransportationFormField('from_city', e.target.value)} />
			<Input placeholder="e.g Lagos State" title="From State" titled value={transportationFormData.from_state} onChangeInput={(e) => updateTransportationFormField('from_state', e.target.value)} />
			<Input placeholder="e.g Nigeria" title="From Country" titled value={transportationFormData.from_country} onChangeInput={(e) => updateTransportationFormField('from_country', e.target.value)} />

			<Input placeholder="e.g Abuja" title="To City" titled value={transportationFormData.to_city} onChangeInput={(e) => updateTransportationFormField('to_city', e.target.value)} />
			<Input placeholder="e.g FCT" title="To State" titled value={transportationFormData.to_state} onChangeInput={(e) => updateTransportationFormField('to_state', e.target.value)} />
			<Input placeholder="e.g Nigeria" title="To Country" titled value={transportationFormData.to_country} onChangeInput={(e) => updateTransportationFormField('to_country', e.target.value)} />

			<Input placeholder="e.g https://booking.com/..." title="Booking Link" titled value={transportationFormData.booking_link} onChangeInput={(e) => updateTransportationFormField('booking_link', e.target.value)} />

			<Input
				placeholder="e.g 20000"
				title="Price"
				type="number"
				optionsLeft={currencyCodes}
				titled
				value={transportationFormData.price || ''}
				onChangeInput={(e) => updateTransportationFormField('price', e.target.value)}
				onSelectLeft={(val) => updateTransportationFormField('currency_code', val)}
				defaultSelectedLeft={transportationFormData.currency_code}
			/>

			<Input 
                placeholder="e.g 08::30" 
                title="Estimated Time" 
                titled 
                value={transportationFormData.duration} 
                onChangeInput={(e) => updateTransportationFormField('duration', e.target.value)} 
                options={["hrs", "mins", "hrs::mins"]}
                onSelectRight={(val) => updateTransportationFormField('duration_time', val)}
                defaultSelectedRight={"hrs"}
            />

			<Input dropdown_only title="Rating" options={["1","2","3","4","5"]} titled onSelectRight={(val) => updateTransportationFormField('rating', val)} defaultSelectedRight={transportationFormData.rating ?? undefined} />

			<NoteInput initialNotes={transportationFormData.notes} onChange={(n) => updateTransportationFormField('notes', n)} />

			<div className='mt-6 space-y-4'>
				<div className='flex items-center justify-between'>
					<h2 className='text-base font-medium'>Review</h2>
				</div>
				<Input placeholder="Write your review here..." type="text" value={transportationFormData.review} onChangeInput={(e) => updateTransportationFormField('review', e.target.value)} />
			</div>

			<button onClick={handleSubmit} disabled={transportationLoading} className="w-full py-3 text-center bg-brand text-white rounded-xl my-3 mb-5">
				{transportationLoading ? (isUpdating ? 'Updating...' : 'Adding...') : (isUpdating ? 'Update' : 'Add')}
			</button>
		</div>
	)
}

